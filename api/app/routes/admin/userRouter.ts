import * as express from "express";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { GetUserList } from "../../controller/admin/user/user_list";
import { updateVendorStatus } from "../../controller/admin/user/verify_vendor";
import { getUserById } from "../../controller/admin/user/user_view";

const AdminUserRouter = express.Router();
AdminUserRouter.get("/list/:page", AdminAuthValidator, GetUserList);
AdminUserRouter.post("/update_vendor", AdminAuthValidator, updateVendorStatus);
AdminUserRouter.get("/view/:id", AdminAuthValidator, getUserById);
export default AdminUserRouter;
