import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { createUserSubImages } from "../../controller/user/properties/create_image";
import { createUserProperty } from "../../controller/user/properties/create";
import { deleteUserPropertyImg } from "../../controller/user/properties/delete_image";
import { updateUserPropertyImg } from "../../controller/user/properties/edit_image";
import { updateUserProperty } from "../../controller/user/properties/edit";
import { listUserProperties } from "../../controller/user/properties/list";
import { viewUserProperty } from "../../controller/user/properties/view";
import { editPropertyVariant } from "../../controller/admin/properties/property_veriants/edit";
import { editPropertyUserVariant } from "../../controller/user/properties/property_veriants/edit";
import { createPropertyUserVariant } from "../../controller/user/properties/property_veriants/create";
import { createPricingVariant } from "../../controller/user/properties/property_pricing/add";
import { updatePricingVariant } from "../../controller/user/properties/property_pricing/edit";

const PropertyUserRouter = express.Router();
PropertyUserRouter.post("/create_property",UserAuthValidator,createUserProperty);
PropertyUserRouter.post("/edit_property",UserAuthValidator,updateUserProperty);
PropertyUserRouter.get("/list/:page",UserAuthValidator,listUserProperties);
PropertyUserRouter.post("/create_image",UserAuthValidator,createUserSubImages);
PropertyUserRouter.post("/edit_image",UserAuthValidator,updateUserPropertyImg);
PropertyUserRouter.get("/delete_image",UserAuthValidator,deleteUserPropertyImg);
PropertyUserRouter.get("/view_property",UserAuthValidator,viewUserProperty);
PropertyUserRouter.post("/create_variant",UserAuthValidator,createPropertyUserVariant);
PropertyUserRouter.post("/edit_variant",UserAuthValidator,editPropertyUserVariant);

PropertyUserRouter.post("/create_price",UserAuthValidator,createPricingVariant);
PropertyUserRouter.post("/edit_price",UserAuthValidator,updatePricingVariant);
export default PropertyUserRouter;