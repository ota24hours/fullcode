import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { listUserSubCategories } from "../../controller/user/sub_category/list_sub_category";

const subCategoryUserRouter = express.Router();
subCategoryUserRouter.get("/list/:page", UserAuthValidator, listUserSubCategories);
export default subCategoryUserRouter;
