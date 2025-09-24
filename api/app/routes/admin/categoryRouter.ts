import * as express from "express";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { createCategory } from "../../controller/admin/category/create";
import { updateCategory } from "../../controller/admin/category/edit";
import { listCategories } from "../../controller/admin/category/list";

const CategoryRouter = express.Router();
CategoryRouter.post("/create",AdminAuthValidator,createCategory);
CategoryRouter.post("/update",AdminAuthValidator,updateCategory);
CategoryRouter.get("/list/:page", AdminAuthValidator, listCategories);
export default CategoryRouter;
