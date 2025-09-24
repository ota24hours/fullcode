import * as express from "express";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { createProperty } from "../../controller/admin/properties/create";
import { updateProperty } from "../../controller/admin/properties/edit";
import { listProperties } from "../../controller/admin/properties/list";
import { createSubImages } from "../../controller/admin/properties/create_image";
import { updatePropertyImg } from "../../controller/admin/properties/edit_image";
import { deletePropertyImg } from "../../controller/admin/properties/delete_image";
import { viewProperty } from "../../controller/admin/properties/view";
import { createPropertyVariant } from "../../controller/admin/properties/property_veriants/create";
import { editPropertyVariant } from "../../controller/admin/properties/property_veriants/edit";
import { createPricingVariant } from "../../controller/user/properties/property_pricing/add";
import { updatePricingVariant } from "../../controller/user/properties/property_pricing/edit";

const PropertyAdminRouter = express.Router();
PropertyAdminRouter.post("/create_property",AdminAuthValidator,createProperty);
PropertyAdminRouter.post("/edit_property",AdminAuthValidator,updateProperty);
PropertyAdminRouter.get("/list/:page",AdminAuthValidator,listProperties);
PropertyAdminRouter.post("/create_image",AdminAuthValidator,createSubImages);
PropertyAdminRouter.post("/edit_image",AdminAuthValidator,updatePropertyImg);
PropertyAdminRouter.get("/delete_image",AdminAuthValidator,deletePropertyImg);
PropertyAdminRouter.get("/view_property",AdminAuthValidator,viewProperty);
PropertyAdminRouter.post("/create_variant",AdminAuthValidator,createPropertyVariant);
PropertyAdminRouter.get("/edit_variant",AdminAuthValidator,editPropertyVariant);

///
PropertyAdminRouter.post("/create_price",AdminAuthValidator,createPricingVariant);
PropertyAdminRouter.post("/edit_price",AdminAuthValidator,updatePricingVariant);


export default PropertyAdminRouter;
