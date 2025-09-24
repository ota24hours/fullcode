import { Request, Response } from "express";
import {
  cToBooleanSafe,
  DeleteLocalServerFile,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Property } from "../../../../src/entity/properties";
import { Category } from "../../../../src/entity/category";
import { Sub_Category } from "../../../../src/entity/sub_category";
import { FileUploadToLocalServer } from "../../../../utils/file_upload";
import { getPaginationValues } from "../../../../utils/pagination";
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

export const listProperties = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const pagination = getPaginationValues(page);
    const { propertyType, search, isActive } = req.query;

    const repo = AppDataSource.getRepository(Property);
    const qb = repo
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.cat_id", "c")
      .leftJoinAndSelect("p.sub_cat_id", "sc")
      .leftJoinAndSelect("p.property_variants", "variants")
      .leftJoinAndSelect("variants.propertyImgs", "pro")
      .leftJoinAndSelect("variants.propertyPricing", "pricing");

    if (hasData(propertyType)) {
      const pt = (propertyType as string).trim();
      if (!Object.values(Property.prototype.propertyType.constructor).includes(pt)) {
        throw new Error("`propertyType` filter must be a valid enum member if provided.");
      }
      qb.andWhere("p.propertyType = :pt", { pt });
    }

    if (hasData(search)) {
      const term = `%${(search as string).trim().toLowerCase()}%`;
      qb.andWhere("LOWER(p.name) LIKE :term", { term });
    }

    if (hasData(isActive)) {
      const activeBool = cToBooleanSafe(isActive);
      qb.andWhere("p.isActive = :activeBool", { activeBool });
    }

    const [rows, total] = await qb
      .orderBy("p.createdAt", "DESC")
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    const baseUrl = (process.env.IMAGE_BASE_URL || "").replace(/\/+$/, "");
    const now = new Date();

    const withFullUrls = rows.map(prop => {
      // Prefix main image
      if (hasData(prop.image)) {
        prop.image = `${baseUrl}${prop.image.startsWith("/") ? "" : "/"}${prop.image}`;
      }

      // Process each variant
      prop.property_variants?.forEach(variant => {
        // Prefix variant images
        variant.propertyImgs?.forEach(pi => {
          if (hasData(pi.img_url)) {
            pi.img_url = `${baseUrl}${pi.img_url.startsWith("/") ? "" : "/"}${pi.img_url}`;
          }
        });

        // Pick the active price
        const pricingList = variant.propertyPricing ?? [];
        const activePrice = pricingList.find(pr =>
          pr.isActive &&
          new Date(pr.startDate) <= now &&
          now <= new Date(pr.endDate)
        );
        if (activePrice) {
          // attach a friendly `rate` field
          (variant as any).rate = Number(activePrice.rate);
        }

        // Group extraData and detailsData
        const rawExtra = Array.isArray(variant.extraData)
          ? (variant.extraData as ExtraItem[])
          : [];
        const rawDetails = Array.isArray(variant.detailsData)
          ? (variant.detailsData as ExtraItem[])
          : [];

        (variant as any).extraData = groupByMainOptions(rawExtra);
        (variant as any).detailsData = groupByMainOptions(rawDetails);
      });

      return prop;
    });

    return toJson(res, {
      data: {
        properties: withFullUrls,
        total,
        limit: pagination.limit,
        page: pagination.page,
      },
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};