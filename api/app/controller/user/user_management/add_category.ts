import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";
import { Category } from "../../../../src/entity/category";
import { Sub_Category } from "../../../../src/entity/sub_category";
import { UserSelectCategories } from "../../../../src/entity/user_select_categories";

export const createUserSelectCategory = async (req: Request, res: Response) => {
  try {

     if (!req.user || !req.user.id) {
      throw new Error("Unauthenticated");
    }
    const {
      cat_id,
      sub_cat_id,
      name,
      user_id,
      place,
      license_no,
      vehicle_no,
    } = req.body;

    let userId=user_id?user_id:req.user.id;

       
    const categoryRepo = AppDataSource.getRepository(Category);
    const subCategoryRepo = AppDataSource.getRepository(Sub_Category);
    const userRepo = AppDataSource.getRepository(User);
    const userSelectCatRepo = AppDataSource.getRepository(UserSelectCategories);

    const category = cat_id ? await categoryRepo.findOneBy({ id: cat_id }) : null;
    const subCategory = sub_cat_id ? await subCategoryRepo.findOneBy({ id: sub_cat_id }) : null;
    const user =  await userRepo.findOneBy({ id: req.user.id }) ;

       if (!user) {
      throw new Error("User not found");
    }

    const newEntry = userSelectCatRepo.create({
      cat_id: category,
      sub_cat_id: subCategory,
      user_id: user,
      name,
      place,
      license_no,
      vehicle_no,
    });

    await userSelectCatRepo.save(newEntry);
    return res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    console.error("Create UserSelectCategory Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
