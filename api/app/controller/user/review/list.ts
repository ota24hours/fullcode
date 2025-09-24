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
import { PropertyImgs } from "../../../../src/entity/properties_imgs";
import { Review } from "../../../../src/entity/reviews";
import { getPaginationValues } from "../../../../utils/pagination";

export const listReviews = async (req: Request, res: Response) => {
  try {
    const reviewRepo = AppDataSource.getRepository(Review);
    const { propertyId, categoryId } = req.query as any;
    const pagination = getPaginationValues(req.params.page);

    // Base query for fetching paginated reviews
    const qb = reviewRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'user')
      .leftJoinAndSelect('r.property', 'property')
      .leftJoinAndSelect('r.category', 'category');

    if (propertyId) {
      qb.andWhere('r.property.id = :propertyId', { propertyId });
    }
    if (categoryId) {
      qb.andWhere('r.category.id = :categoryId', { categoryId });
    }

    // Fetch paginated reviews and total count
    const [items, total] = await qb
      .orderBy('r.createdAt', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    // Fetch counts grouped by star rating
    const countQb = reviewRepo.createQueryBuilder('r')
      .select('r.rating', 'rating')
      .addSelect('COUNT(r.id)', 'count');

    if (propertyId) {
      countQb.andWhere('r.property.id = :propertyId', { propertyId });
    }
    if (categoryId) {
      countQb.andWhere('r.category.id = :categoryId', { categoryId });
    }

    const rawCounts: { rating: number; count: string }[] = await countQb
      .groupBy('r.rating')
      .getRawMany();

    // Normalize counts into an object keyed by rating
    const ratingCounts: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    rawCounts.forEach(rc => {
      ratingCounts[rc.rating] = parseInt(rc.count, 10);
    });

    return toJson(res, {
      data: {
        reviews: items,
        total,
        ratingCounts  // e.g., {1: 10, 2: 5, 3: 8, 4: 12, 5: 20}
      }
    });
  } catch (err: any) {
    return errorResponse(res, err);
  }
};
