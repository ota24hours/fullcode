import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";
import { Category } from "../../../../src/entity/category";
import { Sub_Category } from "../../../../src/entity/sub_category";
import { UserSelectCategories } from "../../../../src/entity/user_select_categories";

export const updateUserSelectCategory = async (req: Request, res: Response) => {
  try {

    const {
        id,
      cat_id,
      sub_cat_id,
      user_id,
      name,
      place,
      license_no,
      vehicle_no,
    } = req.body;

    const userSelectCatRepo = AppDataSource.getRepository(UserSelectCategories);
    const existing = await userSelectCatRepo.findOne({
      where: { id:id },
      relations: ["cat_id", "sub_cat_id", "user_id"],
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Entry not found" });
    }

    if (cat_id) {
      const category = await AppDataSource.getRepository(Category).findOneBy({ id: cat_id });
      existing.cat_id = category ?? null;
    }

    if (sub_cat_id) {
      const subCategory = await AppDataSource.getRepository(Sub_Category).findOneBy({ id: sub_cat_id });
      existing.sub_cat_id = subCategory ?? null;
    }

    if (user_id) {
      const user = await AppDataSource.getRepository(User).findOneBy({ id: user_id });
      existing.user_id = user ?? null;
    }
    
    existing.name = name ?? existing.name;
    existing.place = place ?? existing.place;
    existing.license_no = license_no ?? existing.license_no;
    existing.vehicle_no = vehicle_no ?? existing.vehicle_no;

    await userSelectCatRepo.save(existing);
    return res.status(200).json({ success: true, data: existing });
  } catch (error) {
    console.error("Update UserSelectCategory Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
