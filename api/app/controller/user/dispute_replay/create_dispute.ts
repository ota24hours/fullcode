import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Booking } from "../../../../src/entity/booking";

export const raiseBookingDispute = async (req: Request, res: Response) => {
  try {
    const { bookingId, title, message } = req.body;
    if (!hasData(bookingId) || !hasData(title) || !hasData(message)) {
      throw new Error('`bookingId`, `title`, and `message` are required');
    }
    // Ensure booking exists
    const booking = await AppDataSource.getRepository(Booking).findOneOrFail({ where: { id: bookingId } });

    const disputeRepo = AppDataSource.getRepository('BookingDispute');
    const dispute = disputeRepo.create({
      booking,
      title,
      message,
      status: 'OPEN',
    });
    await disputeRepo.save(dispute);

    return toJson(res, { data: dispute, message: 'Dispute raised successfully' });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};