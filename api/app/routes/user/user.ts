import * as express from "express";
import { UserLogin } from "../../controller/user/login/login";
import { createUser } from "../../controller/user/sign_up/sign_up";
import { UserAuthValidator } from "../../middleware/user_validator";
import { getUserProfile } from "../../controller/user/user_management/profile";
import { updateUserProfile } from "../../controller/user/user_management/update";
import { createUserSelectCategory } from "../../controller/user/user_management/add_category";
import { updateUserSelectCategory } from "../../controller/user/user_management/update_category";
import { verifyOtp } from "../../controller/user/login/verify";
import { createOrUpdateSupportingDocuments } from "../../controller/user/user_management/add_supporting_docs/create";
import { updateSupportingDocument } from "../../controller/user/user_management/add_supporting_docs/edit";



const UserRouter = express.Router();

UserRouter.post("/login",UserLogin);
UserRouter.post("/create_user",createUser);
UserRouter.post("/verify_user",verifyOtp);
UserRouter.get("/profile",UserAuthValidator,getUserProfile);
UserRouter.post("/update",UserAuthValidator,updateUserProfile);
UserRouter.post("/add_user_categories",UserAuthValidator,createUserSelectCategory);
UserRouter.post("/edit_user_categories",UserAuthValidator,updateUserSelectCategory);
UserRouter.post("/add_supporting_docs",UserAuthValidator,createOrUpdateSupportingDocuments);
UserRouter.post("/edit_supporting_docs",UserAuthValidator,updateSupportingDocument);

export default UserRouter;
