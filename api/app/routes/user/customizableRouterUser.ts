import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { listCategoriesUser } from "../../controller/user/category/list";
import { listCustomizableUserItems } from "../../controller/user/customize/list";
import { listMainOptions } from "../../controller/user/customize/list_enum";

const CustomizableUserRouter = express.Router();
CustomizableUserRouter.get("/list/:page", UserAuthValidator, listCustomizableUserItems);
CustomizableUserRouter.get("/customize", UserAuthValidator, listMainOptions);

export default CustomizableUserRouter;