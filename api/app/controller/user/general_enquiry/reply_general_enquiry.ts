import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Booking } from "../../../../src/entity/booking";
import { GeneralEnquiry } from "../../../../src/entity/general_enquiry";
import { EnquiryReply } from "../../../../src/entity/enquiry_replay";

export const replyToEnquiry = async (req: Request, res: Response) => {
  try {
    const { enquiryId, message } = req.body;
    if (!enquiryId || !message) throw new Error("enquiryId and message required");

    const enquiryRepo = AppDataSource.getRepository(GeneralEnquiry);
    const enquiry = await enquiryRepo.findOneOrFail({ where: { id: enquiryId } });

    const replyRepo = AppDataSource.getRepository(EnquiryReply);
    const reply = replyRepo.create({
      enquiry,
      message,
      repliedAt: new Date(),
    });
    await replyRepo.save(reply);

    enquiry.status = 'REPLIED';
    await enquiryRepo.save(enquiry);

    return toJson(res, { data: reply });
  } catch (error) {
    return errorResponse(res, error);
  }
};
