import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { listCategoriesUser } from "../../controller/user/category/list";

const CategoryUserRouter = express.Router();
CategoryUserRouter.get("/list/:page", listCategoriesUser);

export default CategoryUserRouter;
