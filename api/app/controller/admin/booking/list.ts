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
import { Booking } from "../../../../src/entity/booking";


export const listAdminBookings = async (req: Request, res: Response) => {
  try {
    const pagination = getPaginationValues(req.params.page);
    const { status, propertyId, fromDate, toDate, userId ,vendorId } = req.query;

    const repo = AppDataSource.getRepository(Booking);
    const qb = repo
      .createQueryBuilder("b")
      .leftJoinAndSelect("b.property", "p")
      .leftJoinAndSelect("b.variant", "variant")
      .leftJoinAndSelect("p.property_variants", "propertyVariants")
      .leftJoinAndSelect("propertyVariants.propertyImgs", "propertyImgs")
      .leftJoinAndSelect("b.user", "u");

      if(hasData(vendorId)) {
      qb.andWhere("property.user_id = :vendorId", { vendorId: String(vendorId) });
    }

    if (hasData(status)) {
      qb.andWhere("b.status = :status", { status: status as string });
    }
    if (hasData(propertyId)) {
      qb.andWhere("b.propertyId = :propertyId", { propertyId: String(propertyId) });
    }
    if (hasData(userId)) {
      qb.andWhere("b.userId = :userId", { userId: String(userId) });
    }

    if (hasData(fromDate) && hasData(toDate)) {
      const from = new Date(fromDate as string);
      const to   = new Date(toDate   as string);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        throw new Error("`fromDate` and `toDate` must be valid dates (YYYY-MM-DD).");
      }
      qb.andWhere("b.startDate BETWEEN :from AND :to", { from, to });
    } else if (hasData(fromDate)) {
      const from = new Date(fromDate as string);
      if (isNaN(from.getTime())) {
        throw new Error("`fromDate` must be a valid date (YYYY-MM-DD).");
      }
      qb.andWhere("b.startDate >= :fromOnly", { fromOnly: from });
    } else if (hasData(toDate)) {
      const to = new Date(toDate as string);
      if (isNaN(to.getTime())) {
        throw new Error("`toDate` must be a valid date (YYYY-MM-DD).");
      }
      qb.andWhere("b.startDate <= :toOnly", { toOnly: to });
    }

    const [rows, total] = await qb
      .orderBy("b.createdAt", "DESC")
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();
        // 6) Prefix all image URLs
    const BASE_URL = process.env.BASE_URL || "https://your.cdn-or-domain.com";

    const bookings = rows.map(booking => {
      // 6a) main property image
      if (booking.property?.image) {
        booking.property.image = `${BASE_URL}${booking.property.image}`;
      }

      // 6b) each variant’s img_url
      if (booking.property?.property_variants) {
        booking.property.property_variants = booking.property.property_variants.map(pv => {
          if (pv.img_url) {
            pv.img_url = `${BASE_URL}${pv.img_url}`;
          }
          // 6c) nested propertyImgs[]
          if (pv.propertyImgs) {
            pv.propertyImgs = pv.propertyImgs.map(pi => {
              if (pi.img_url) {
                pi.img_url = `${BASE_URL}${pi.img_url}`;
              }
              return pi;
            });
          }
          return pv;
        });
      }

      // 6d) if you still have a top‑level variant object you want to prefix too
      if (booking.variant?.img_url) {
        booking.variant.img_url = `${BASE_URL}${booking.variant.img_url}`;
      }

      return booking;
    });

    return toJson(res, {
      data: {
        bookings: bookings,
        total,
        limit: pagination.limit,
        page: pagination.page,
      },
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};
