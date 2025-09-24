import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus, USER_TYPE } from "../../../../src/entity/enum";
import { Brackets } from "typeorm";


export const listBookings = async (req: Request, res: Response) => {
  try {
    // 1) Parse page from URL param (e.g. GET /bookings/list/2)
    const pagination = getPaginationValues(req.params.page);

    // 2) Extract filter query params
    const { status, propertyId, fromDate, toDate, search } = req.query;


    // 3) Build QueryBuilder on Booking ("b")
    const repo = AppDataSource.getRepository(Booking);
    const qb = repo
      .createQueryBuilder("b")
      .leftJoinAndSelect("b.property", "p")
      .leftJoinAndSelect("b.variant", "variant")
      .leftJoinAndSelect("p.property_variants", "propertyVariants")
      .leftJoinAndSelect("propertyVariants.propertyImgs", "propertyImgs")
      .leftJoinAndSelect("b.user", "u")
      .leftJoinAndSelect("variant.propertyPricing", "pricing");
    ;

    // 4) Apply filters if provided
    if (hasData(status)) {
      qb.andWhere("b.status = :status", { status: status as string });
    }
    if (hasData(propertyId)) {
      qb.andWhere("b.propertyId = :propertyId", { propertyId: String(propertyId) });
    }
    if(req?.user?.user_type===USER_TYPE.VENDOR){
      qb.andWhere("p.user_id = :vendorId", { vendorId: String(req.user.id) });
    }
    if (hasData(req.user?.id)) {
      qb.andWhere("u.id = :userId", { userId: String(req.user.id) });
    }
    if (hasData(fromDate) && hasData(toDate)) {
      const from = new Date(fromDate as string);
      const to = new Date(toDate as string);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        throw new Error("\`fromDate\` and \`toDate\` must be valid dates (YYYY-MM-DD).");
      }
      qb.andWhere("b.startDate BETWEEN :from AND :to", { from, to });
    } else if (hasData(fromDate)) {
      const from = new Date(fromDate as string);
      if (isNaN(from.getTime())) {
        throw new Error("\`fromDate\` must be a valid date (YYYY-MM-DD).");
      }
      qb.andWhere("b.startDate >= :fromOnly", { fromOnly: from });
    } else if (hasData(toDate)) {
      const to = new Date(toDate as string);
      if (isNaN(to.getTime())) {
        throw new Error("\`toDate\` must be a valid date (YYYY-MM-DD).");
      }
      qb.andWhere("b.startDate <= :toOnly", { toOnly: to });
    }

    // 4.1) Apply free-text search if provided
    if (hasData(search)) {
      const term = `%${(search as string).trim().toLowerCase()}%`;
      qb.andWhere(new Brackets(qb1 => {
        qb1
          .where("LOWER(b.id::text) LIKE :term", { term })
          .orWhere("LOWER(p.name)        LIKE :term", { term })
          .orWhere("LOWER(variant.name)  LIKE :term", { term })
          .orWhere("LOWER(u.name)        LIKE :term", { term })
          .orWhere("LOWER(u.email)       LIKE :term", { term });
      }));
    }

    // 5) Pagination + sorting (most recent first)
    const [rows, total] = await qb
      .orderBy("b.createdAt", "DESC")
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    // 6) Prune user fields for each booking

    const BASE_URL = process.env.IMAGE_BASE_URL;

    const bookings = rows.map(booking => {
      // 1) Prune user
      if (booking.user) {
        const { id, name, phone, email } = booking.user;
        booking.user = { id, name, phone, email } as any;
      }

      // 1) Prepend base URL onto the main property.image
  if (booking.property?.image) {
    booking.property.image = `${BASE_URL}${booking.property.image}`;
  }

      // 2) Prepend base URL onto all images in property.property_variants
      if (booking.property?.property_variants) {
        booking.property.property_variants = booking.property.property_variants.map(pv => {
          if (pv.img_url) pv.img_url = `${BASE_URL}${pv.img_url}`;
          if (pv.propertyImgs) {
            pv.propertyImgs = pv.propertyImgs.map(pi => {
              if (pi.img_url) pi.img_url = `${BASE_URL}${pi.img_url}`;
              return pi;
            });
          }
          return pv;
        });
      }

      // 3) Reshape: keep only the variant that matches booking.variant.id
      if (booking.property?.property_variants && booking.variant) {
        const selected = booking.property.property_variants.find(
          pv => pv.id === booking.variant.id
        );
        booking.property.property_variants = selected ? [selected] : [];
      }

      // 4) Drop the top‑level variant

      return booking;
    });

    // 7) Return JSON
    return toJson(res, {
      data: {
        bookings,
        total,
        limit: pagination.limit,
        page: pagination.page,
      },
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};