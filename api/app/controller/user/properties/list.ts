import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus, USER_TYPE } from "../../../../src/entity/enum";


type ExtraItem = {
  key: string;
  value: any;
  icon_url?: string;
  mainOptions: string;
};
function groupByMainOptions(items: ExtraItem[] = []): Record<string, ExtraItem[]> {
  return items.reduce((acc, item) => {
    const groupKey = item.mainOptions || "default";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, ExtraItem[]>);
}

export const listUserProperties = async (req: Request, res: Response) => {
  try {
    // 1) Parse page from URL param and filters
    const pagination = getPaginationValues(req.params.page);
    const {
      propertyType,
      search,
      isActive,
      latitude,
      longitude,
      cat_id,
      sub_cat_ids,
      categoryGroup,
      startDate,
      endDate,
      usersCount,
      child_count,
      minRate,
      maxRate,
      acFilter,
      minCapacity,
      maxCapacity,
    } = req.query;

    // 2) Validate date filters if present
    let startFilter: Date | null = null;
    let endFilter: Date | null = null;

    if (hasData(startDate)) {
      startFilter = new Date(startDate as string);
      if (isNaN(startFilter.getTime())) throw new Error("`startDate` must be YYYY-MM-DD.");
    }
    if (hasData(endDate)) {
      endFilter = new Date(endDate as string);
      if (isNaN(endFilter.getTime())) throw new Error("`endDate` must be YYYY-MM-DD.");
    }

    // 3) Numeric filters
    const minChildCount = hasData(child_count) ? parseInt(child_count as string) : null;
    const minRateNum = hasData(minRate) ? parseFloat(minRate as string) : null;
    const maxRateNum = hasData(maxRate) ? parseFloat(maxRate as string) : null;
    const minCap = hasData(minCapacity) ? parseFloat(minCapacity as string) : null;
    const maxCap = hasData(maxCapacity) ? parseFloat(maxCapacity as string) : null;

    // 4) Parse usersCount filter if present
    let minUsers: number | null = null;
    if (hasData(usersCount)) {
      const uc = Number(usersCount);
      if (isNaN(uc) || uc < 1) {
        throw new Error("`usersCount` must be a positive integer.");
      }
      minUsers = uc;
    }

    // 5) Build base query with relations
    const repo = AppDataSource.getRepository(Property);
    const qb = repo
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.cat_id", "c")
      .leftJoinAndSelect("p.sub_cat_id", "sc")
      .leftJoinAndSelect("p.user_id", "u")
      .leftJoinAndSelect("p.property_variants", "v")
      .leftJoinAndSelect("v.propertyImgs", "pro")
      .leftJoinAndSelect("v.propertyPricing", "pricing");

    // ... other filters omitted for brevity ...

    
     if (hasData(propertyType)) {
      qb.andWhere("p.propertyType = :pt", { pt: (propertyType as string).trim() });
    }
    if (hasData(search)) {
      const term = `%${(search as string).trim().toLowerCase()}%`;
      qb.andWhere("LOWER(p.name) LIKE :term", { term });
    }
    if (hasData(cat_id)) {
      qb.andWhere("p.cat_id = :catId", { catId: cat_id });
    }
    if (hasData(isActive)) {
      qb.andWhere("p.isActive = :active", { active: cToBooleanSafe(isActive) });
    }
    // 6) Apply variant-level usersCount filter
    if (minUsers !== null) {
      qb.andWhere("v.person_allowed >= :minUsers", { minUsers });
    }
    if (req.user?.user_type === USER_TYPE.VENDOR) {
      qb.andWhere('u.id = :uid', { uid: req.user.id });
    }

    if (req.user?.user_type === USER_TYPE.USER) {
      qb.andWhere('u.active_status = :activeStatus', { activeStatus: cToBooleanSafe(true) });
    }

if (hasData(sub_cat_ids)) {
      const ids = (sub_cat_ids as string).split(',').map(i => i.trim());
      qb.andWhere('c.id IN (:...ids)', { ids });
    }

        // Geolocation (within ~10km radius)
    // if (hasData(latitude) && hasData(longitude)) {
    //   const lat = parseFloat(latitude as string);
    //   const lon = parseFloat(longitude as string);
    //   // Haversine approximation
    //   qb.andWhere(`(6371 * acos(
    //     cos(radians(:lat)) * cos(radians(p.latitude)) *
    //     cos(radians(p.longitude) - radians(:lon)) +
    //     sin(radians(:lat)) * sin(radians(p.latitude))
    //   )) <= :radius`, { lat, lon, radius: 10 });
    // }

    if (minRateNum !== null) qb.andWhere('p.rate >= :minRate', { minRate: minRateNum });
    if (maxRateNum !== null) qb.andWhere('p.rate <= :maxRate', { maxRate: maxRateNum });

    // Capacity range
    if (minCap !== null) qb.andWhere('p.capacity >= :minCap', { minCap });
    if (maxCap !== null) qb.andWhere('p.capacity <= :maxCap', { maxCap });

    // AC filter (amenities JSON simple-array)
    if (hasData(acFilter) && cToBooleanSafe(acFilter)) {
      qb.andWhere("FIND_IN_SET('AC', p.amenities) > 0");
    }

    // Variant-level filters
    if (minUsers !== null) {
      qb.andWhere('v.person_allowed >= :minUsers', { minUsers });
    }
    if (minChildCount !== null) {
      qb.groupBy('p.id')
        .andHaving('COUNT(v.id) >= :minChildCount', { minChildCount });
    }


    // 6) Execute query with pagination
    const [rows, total] = await qb
      .orderBy("p.createdAt", "DESC")
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    // 7) Attach dynamic rate and transform results
    const baseUrl = (process.env.IMAGE_BASE_URL || "").replace(/\/+$/, "");
    const now = new Date();

    const properties = rows.map((prop) => {
      // prefix main image
      if (hasData(prop.image)) {
        prop.image = `${baseUrl}${prop.image.startsWith("/") ? "" : "/"}${prop.image}`;
      }

      prop.property_variants?.forEach((variant) => {
      

        // prefix variant images
        variant.propertyImgs?.forEach((pi) => {
          if (hasData(pi.img_url)) {
            pi.img_url = `${baseUrl}${pi.img_url.startsWith("/") ? "" : "/"}${pi.img_url}`;
          }
        });

        if (req?.user?.user_type === USER_TYPE.USER) {
            // Apply active pricing rate override
        const activePrice = variant.propertyPricing?.find((pr) =>
          pr.isActive &&
          new Date(pr.startDate) <= now &&
          now <= new Date(pr.endDate)
        );
        if (activePrice) {
          (variant as any).rate = Number(activePrice.rate);
        }
          // group extraData/detailsData
          const rawExtra = Array.isArray(variant.extraData) ? (variant.extraData as ExtraItem[]) : [];
          const rawDetails = Array.isArray(variant.detailsData) ? (variant.detailsData as ExtraItem[]) : [];
          (variant as any).extraData = groupByMainOptions(rawExtra);
          (variant as any).detailsData = groupByMainOptions(rawDetails);
        }
      });

      return prop;
    });

    // 8) Return
    return toJson(res, {
      data: { properties, total, limit: pagination.limit, page: pagination.page, userType: req.user?.user_type, userId: req.user?.id },
    });
  } catch (error: any) {
    return errorResponse(res, error.message ?? error);
  }
};


