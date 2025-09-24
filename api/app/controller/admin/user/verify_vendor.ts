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
import { VENDOR_VERIFICATION_STATUS } from "../../../../src/entity/enum";

export const updateVendorStatus = async (req: Request, res: Response) => {
  try {
    // 1) Ensure the caller is authenticated (AdminAuthValidator should have run already)
    const adminData = req.admin;
    if (!adminData?.id) {
      throw new Error("Admin not authenticated");
    }

    // 3) Read desired status from request body
    const { status,vendorId } = req.body;


    // 4) Load the Vendor entity
    const vendorRepo = AppDataSource.getRepository(User);
    const vendor = await vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // 5) Update fields
    vendor.verified_status = status;

    if (status === VENDOR_VERIFICATION_STATUS.VERIFIED) {
      vendor.verified = true;
      vendor.verified_by = adminData.id.toString();
      vendor.verified_at = new Date();
    } else if (status === VENDOR_VERIFICATION_STATUS.REJECTED) {
      vendor.verified = false;
      vendor.verified_by = adminData.id.toString();
      vendor.verified_at = new Date();
    } else if (status === VENDOR_VERIFICATION_STATUS.PENDING) {
      vendor.verified = null;
      vendor.verified_by = null;
      vendor.verified_at = null;
    }

    await vendorRepo.save(vendor);

    // 6) Return success
    return toJson(res, {
      data: {
        vendor_id: vendor.id,
        verified_status: vendor.verified_status,
        verified: vendor.verified,
        verified_by: vendor.verified_by,
        verified_at: vendor.verified_at,
      },
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};