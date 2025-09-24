import { Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { User } from "../../../../src/entity/user";
import { Category } from "../../../../src/entity/category";

export const listCategories = async (req: Request, res: Response) => {
    try {
      const pagination = getPaginationValues(req.params.page);
      const { search, status ,propertyType } = req.query;
      const repo = AppDataSource.getRepository(Category);

      const query = repo.createQueryBuilder('c');
  
      if (hasData(search)) {
        query.andWhere('c.name LIKE :search', { search: `%${search}%` });
      }
      if (hasData(status)) {
        query.andWhere('c.status = :status', { status: cToBooleanSafe(status) });
      }

        if (hasData(propertyType)) {
        query.andWhere('c.propertyType = :propertyType', { propertyType: propertyType });
      }
  
      const [categories, total] = await query
        .orderBy('c.createdAt', 'DESC')
        .skip(pagination.skip)
        .take(pagination.limit)
        .getManyAndCount();
            const baseUrl = process.env.IMAGE_BASE_URL?.replace(/\/+$/, "") || "";
    const category = categories.map(cat => ({
      ...cat,
      img_url: cat.img_url ? `${baseUrl}/${cat.img_url}` : ''
    }));
  
      return toJson(res, { data: { category, total, limit: pagination.limit } });
    } catch (error) {
      return errorResponse(res, error);
    }
  };