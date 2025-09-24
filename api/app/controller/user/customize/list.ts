import { Request, Response } from "express";
import {
  cToBooleanSafe,
  DeleteLocalServerFile,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { User } from "../../../../src/entity/user";
import { Category } from "../../../../src/entity/category";
import { FileUploadToLocalServer } from "../../../../utils/file_upload";
import { CustomizableItem } from "../../../../src/entity/customizable_items";

export const listCustomizableUserItems = async (req: Request, res: Response) => {
  try {
    // 1) Pagination
    const pagination = getPaginationValues(req.params.page);

    // 2) Extract filters
    const { search, status,mainOptions,customItem,propertyType} = req.query;

    // 3) Build QueryBuilder
    const repo = AppDataSource.getRepository(CustomizableItem);
    const qb = repo.createQueryBuilder('ci');

    if (hasData(search)) {
      qb.andWhere('ci.name ILIKE :search', { search: `%${(search as string).trim()}%` });
    }
    if (hasData(status)) {
      qb.andWhere('ci.status = :status', { status: cToBooleanSafe(status) });
    }
    if (hasData(mainOptions)) {
      qb.andWhere('ci.mainOptions = :mainOptions', { mainOptions: mainOptions });
    }

      if (hasData(customItem)) {
      qb.andWhere('ci.customItem = :customItem', { customItem: customItem });
    }

      if (hasData(propertyType)) {
      qb.andWhere('ci.propertyType = :propertyType', { propertyType: propertyType });
    }

    // 4) Apply ordering & pagination
    const [items, total] = await qb
      .orderBy('ci.createdAt', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

         const baseUrl = process.env.IMAGE_BASE_URL?.replace(/\/+$/, '') || '';
    const formattedItems = items.map(item => ({
      ...item,
      icon_url: item.icon_url
        ? `${baseUrl}${item.icon_url.startsWith('/') ? '' : '/'}${item.icon_url}`
        : item.icon_url,
    }));


    // 5) Return JSON in your standard format
    return toJson(res, {
      data: {
        formattedItems,
        total,
        page: pagination.page,
        limit: pagination.limit,
      },
      message: 'CustomizableItems fetched successfully',
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};