import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { getVendorSummary } from "../../controller/user/transactions/list";

const propertyTransactionRouter = express.Router();
propertyTransactionRouter.get("/getSummary", UserAuthValidator, getVendorSummary);
export default propertyTransactionRouter;
