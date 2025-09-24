import { Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { User } from "../../../../src/entity/user";
import { Category } from "../../../../src/entity/category";
import { Sub_Category } from "../../../../src/entity/sub_category";
import { VendorPayment } from "../../../../src/entity/vendor_payment";

export const updateVendorPayment = async (req: Request, res: Response) => {
  try {
    const {paymentId, vendorId, amount, note } = req.body;
    if (!paymentId) throw new Error("`id` URL parameter is required.");
    if (amount != null && Number(amount) <= 0) {
      throw new Error("`amount` must be greater than zero.");
    }

    const repo = AppDataSource.getRepository(VendorPayment);
    const payment = await repo.findOne({
      where: { id: paymentId },
      relations: ["vendor"],
    });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    // (Optional) allow changing vendor
    if (vendorId) {
      const userRepo = AppDataSource.getRepository(User);
      const vendor = await userRepo.findOne({ where: { id: vendorId } });
      if (!vendor) throw new Error(`User with id=${vendorId} not found.`);
      payment.vendor = vendor;
    }

    if (amount != null) payment.amount = amount;
    if (note   != null) payment.note   = note;

    const updated = await repo.save(payment);
    return toJson(res, { data: updated, message: "Payment updated successfully." });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};
