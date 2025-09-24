import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Sub_Category } from "../../../../src/entity/sub_category";
export const listUserSubCategories = async (req: Request, res: Response) => {
  try {
    const pagination = getPaginationValues(req.params.page);
    const { search, status, cat_id,propertyType } = req.query;
    const repo = AppDataSource.getRepository(Sub_Category);

    const qb = repo.createQueryBuilder("sc")
      .leftJoinAndSelect("sc.cat_id", "c"); // join to include Category data if desired

    // ─── If a search term is provided, filter by name (case‐insensitive LIKE) ──
    if (hasData(search)) {
      qb.andWhere("sc.name LIKE :search", { search: `%${search}%` });
    }
     
    // ─── If status filter is provided, coerce to boolean and filter ────────────
    if (hasData(status)) {
      // cToBooleanSafe accepts string|"true"|"false" or actual boolean
      const statusBool = cToBooleanSafe(status);
      qb.andWhere("sc.status = :statusBool", { statusBool });
    }

    // ─── If cat_id filter is provided, parse & filter ─────────────────────────
    if (hasData(cat_id)) {
    
      qb.andWhere("sc.cat_id = :cat_id", { cat_id });
    }

    if (hasData(propertyType)) {
  qb.andWhere('c.propertyType = :propertyType', { propertyType });
}


    // ─── Execute paginated query + get total count ─────────────────────────────
    const [sub_categories, total] = await qb
      .orderBy("sc.createdAt", "DESC")
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    // ─── Return JSON with pagination metadata ─────────────────────────────────
    return toJson(res, {
      data: {
        sub_categories,
        total,
        limit: pagination.limit,
        page: pagination.page,
      },
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};