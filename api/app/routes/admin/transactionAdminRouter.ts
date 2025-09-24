import * as express from "express";
import { AdminAuthValidator } from "../../middleware/admin_validator";
import { createVendorPayment } from "../../controller/admin/trasaction/create";
import { updateVendorPayment } from "../../controller/admin/trasaction/update";
import { listVendorPayments } from "../../controller/admin/trasaction/list";
import { getVendorEarnings } from "../../controller/admin/trasaction/getVendorEranigs";
import { exportVendorPayments } from "../../controller/admin/trasaction/exportVendorEarnings";

const TransactionAdminRouter = express.Router();

TransactionAdminRouter.post("/create_payments",AdminAuthValidator,createVendorPayment);
TransactionAdminRouter.post("/update_payments",AdminAuthValidator,updateVendorPayment);
TransactionAdminRouter.get("/list/:page", AdminAuthValidator, listVendorPayments);
TransactionAdminRouter.get("/getSummary", AdminAuthValidator, getVendorEarnings);
TransactionAdminRouter.get("/downloadVendorPayments", AdminAuthValidator, exportVendorPayments);

export default TransactionAdminRouter;
