import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Booking } from "../../../../src/entity/booking";

export const replyToDispute = async (req: Request, res: Response) => {
  try {
    const { disputeId, replyMessage } = req.body;
    if (!disputeId || !replyMessage) {
      throw new Error('`disputeId` and `replyMessage` are required');
    }
    const disputeRepo = AppDataSource.getRepository('BookingDispute');
    const dispute = await disputeRepo.findOneOrFail({ where: { id: disputeId } });

    const replyRepo = AppDataSource.getRepository('DisputeReply');
    const reply = replyRepo.create({
      dispute,
      message: replyMessage,
      repliedAt: new Date(),
    });
    await replyRepo.save(reply);

    // Optionally update dispute status
    dispute.status = 'REPLIED';
    await disputeRepo.save(dispute);

    return toJson(res, { data: reply });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};
