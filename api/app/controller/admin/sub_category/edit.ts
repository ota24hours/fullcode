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

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const {id, name, cat_id, status } = req.body;

    // ─── Validate id param ────────────────────────────────────────────────────
    if (!hasData(id)) {
      throw new Error("Sub-category `id` parameter is required.");
    }


    // ─── Fetch existing sub-category ───────────────────────────────────────────
    const repo = AppDataSource.getRepository(Sub_Category);
    const existing = await repo.findOne({
      where: { id: id },
      relations: ["cat_id"], // so we can return the Category relation if needed
    });
    if (!existing) {
      throw new Error(`Sub-category with id=${id} not found.`);
    }


    // ─── Update name if provided ──────────────────────────────────────────────
    if (hasData(name)) {

      existing.name = name.trim();
    
    }

    // ─── Update cat_id if provided ─────────────────────────────────────────────
    if (hasData(cat_id)) {
    
      const categoryEntity = await AppDataSource.getRepository(Category).findOne({
        where: { id: cat_id },
      });
      if (!categoryEntity) {
        throw new Error(`Category with id=${cat_id} not found.`);
      }
      existing.cat_id = categoryEntity;
    }

    // ─── Update status if provided ─────────────────────────────────────────────
    if (hasData(status)) {
      existing.status = cToBooleanSafe(status);
    }


    const updated = await repo.save(existing);
    return toJson(res, {
      data: updated,
      message: "Sub-category updated successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};