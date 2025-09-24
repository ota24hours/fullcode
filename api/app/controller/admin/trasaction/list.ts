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

export const listVendorPayments = async (req: Request, res: Response) => {
  try {
    // Pagination values from URL param
    const pagination = getPaginationValues(req.params.page);
    const { vendorId, fromDate, toDate } = req.query;

    const qb = AppDataSource.getRepository(VendorPayment)
      .createQueryBuilder("vp")
      .leftJoinAndSelect("vp.vendor", "v")
      .orderBy("vp.createdAt", "DESC");

    if (hasData(vendorId)) {
      qb.andWhere("v.id = :vendorId", { vendorId: String(vendorId) });
    }
    if (fromDate && toDate) {
      const from = new Date(fromDate as string);
      const to = new Date(toDate as string);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        throw new Error("`fromDate` and `toDate` must be valid ISO dates.");
      }
      qb.andWhere("vp.createdAt BETWEEN :from AND :to", { from, to });
    }

    const [payments, total] = await qb
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    return toJson(res, {
      data: {
        payments,
        total,
        limit: pagination.limit,
        page: pagination.page,
      },
      message: "Payments listed successfully.",
    });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};