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

export const getAdminBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    if (!bookingId) {
      throw new Error("`id` URL parameter is required.");
    }

    const repo = AppDataSource.getRepository(Booking);
    const booking = await repo
      .createQueryBuilder("b")
      // booking → property
      .leftJoinAndSelect("b.property", "p")
      // property → variants
      .leftJoinAndSelect("p.property_variants", "propertyVariants")
      // variant → images
      .leftJoinAndSelect("propertyVariants.propertyImgs", "propertyImgs")
      // booking → the chosen variant
      .leftJoinAndSelect("b.variant", "variant")
      // booking → user
      .leftJoinAndSelect("b.user", "u")
      // restrict to the current user's booking
      .where("b.id = :id",      { id: bookingId })
      .getOne();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking with id=${bookingId} not found or you do not have permission to view it.`,
      });
    }

    // Prune the user object
    if (booking.user) {
      const { id, name, phone, email } = booking.user;
      booking.user = { id, name, phone, email } as any;
    }

    // Prepend your BASE_URL on every image field (main property + variants + imgs)
    const BASE_URL = process.env.IMAGE_BASE_URL || "https://your.domain.com";
    if (booking.property?.image) {
      booking.property.image = `${BASE_URL}${booking.property.image}`;
    }
    if (booking.property?.property_variants) {
      booking.property.property_variants = booking.property.property_variants.map(pv => {
        if (pv.img_url) {
          pv.img_url = `${BASE_URL}${pv.img_url}`;
        }
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

    // Nest only the selected variant under property.property_variants
    if (booking.property?.property_variants && booking.variant) {
      const selected = booking.property.property_variants.find(
        pv => pv.id === booking.variant.id
      );
      booking.property.property_variants = selected ? [selected] : [];
    }
    // Remove the now‐redundant top‐level variant
    // delete booking.variant;

    return toJson(res, {
      data: booking,
      message: "Booking fetched successfully",
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};