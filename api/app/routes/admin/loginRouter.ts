import * as express from "express";
import { login } from "../../controller/admin/admin/login";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { createAdmin } from "../../controller/admin/admin/create";
import { editAdmin } from "../../controller/admin/admin/edit";
import { GetAdminList } from "../../controller/admin/admin/list";
import { GetAdminProfile } from "../../controller/admin/admin/profile";
import { createUserSelectCategory } from "../../controller/user/user_management/add_category";

const AdminRouter = express.Router();
AdminRouter.post("/login",login);
AdminRouter.post("/create_admin",AdminAuthValidator,createAdmin);
AdminRouter.post("/edit_admin",AdminAuthValidator,editAdmin);
AdminRouter.get("/list/:page",AdminAuthValidator,GetAdminList);
AdminRouter.get("/profile",AdminAuthValidator,GetAdminProfile);
AdminRouter.post("/add_user_categories",AdminAuthValidator,createUserSelectCategory);


export default AdminRouter;
