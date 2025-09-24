import * as express from "express";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { createSubCategory } from "../../controller/admin/sub_category/create";
import { updateSubCategory } from "../../controller/admin/sub_category/edit";
import { listSubCategories } from "../../controller/admin/sub_category/list";


const SubCategoryRouter = express.Router();
SubCategoryRouter.post("/create",AdminAuthValidator,createSubCategory);
SubCategoryRouter.post("/update",AdminAuthValidator,updateSubCategory);
SubCategoryRouter.get("/list/:page", AdminAuthValidator, listSubCategories);
export default SubCategoryRouter;
