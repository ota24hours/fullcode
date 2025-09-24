import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus } from "../../../../src/entity/enum";

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const {id, status } = req.body ;
    if (!Object.values(BookingStatus).includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${Object.values(BookingStatus).join(', ')}`
      );
    }

    const bookingRepo = AppDataSource.getRepository(Booking);
    const booking     = await bookingRepo.findOne({ where: { id: String(id) } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = status;
    const updated   = await bookingRepo.save(booking);
    return toJson(res, {
      data: updated,
      message: `Booking ${id} status updated to ${status}.`
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};