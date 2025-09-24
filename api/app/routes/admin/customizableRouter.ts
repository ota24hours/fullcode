import * as express from "express";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { listCustomizableItems } from "../../controller/admin/customizable/list";
import { editCustomizableItem } from "../../controller/admin/customizable/edit";
import { createCustomizableItem } from "../../controller/admin/customizable/create";
import { listMainOptions } from "../../controller/user/customize/list_enum";

const CustomizableRouter = express.Router();
CustomizableRouter.post("/create",AdminAuthValidator,createCustomizableItem);
CustomizableRouter.post("/update",AdminAuthValidator,editCustomizableItem);
CustomizableRouter.get("/list/:page", AdminAuthValidator, listCustomizableItems);
CustomizableRouter.get("/customize", AdminAuthValidator, listMainOptions);
export default CustomizableRouter;