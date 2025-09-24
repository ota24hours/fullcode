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
import { Sub_Category } from "../../../../src/entity/sub_category";

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, cat_id, status } = req.body;



    // ─── Validate Category (cat_id) if provided ───────────────────────────────
    let categoryEntity: Category | null = null;
    if (hasData(cat_id)) {
      // parse as integer if cat_id was sent as string:
      categoryEntity = await AppDataSource.getRepository(Category).findOne({
        where: { id: cat_id },
      });
      if (!categoryEntity) {
        throw new Error(`Category with id=${cat_id} not found.`);
      }
    }

    // ─── Determine status (defaults to true) ───────────────────────────────────
    let statusValue = true;
    if (hasData(status)) {
      statusValue = cToBooleanSafe(status);
    }

    // ─── Create & Save ────────────────────────────────────────────────────────
    const newSub = new Sub_Category();
    newSub.name = name.trim();
    newSub.status = statusValue;
    newSub.cat_id = categoryEntity || null;

    const inserted = await AppDataSource.manager.save(Sub_Category, newSub);

    return toJson(res, {
      data: inserted,
      message: "Sub-category created successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};
