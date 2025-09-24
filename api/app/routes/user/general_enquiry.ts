import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { submitGeneralEnquiry } from "../../controller/user/general_enquiry/create_general_enquiry";
import { replyToEnquiry } from "../../controller/user/general_enquiry/reply_general_enquiry";

const generalEnquiryUserRouter = express.Router();
generalEnquiryUserRouter.post("/create_general_enquiry", UserAuthValidator, submitGeneralEnquiry);
generalEnquiryUserRouter.post("/replay_general_dispute", UserAuthValidator, replyToEnquiry);

export default generalEnquiryUserRouter;