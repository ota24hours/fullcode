import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Booking } from "../../../../src/entity/booking";
import { GeneralEnquiry } from "../../../../src/entity/general_enquiry";

export const submitGeneralEnquiry = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) throw new Error("Subject and message are required");

    const enquiryRepo = AppDataSource.getRepository(GeneralEnquiry);
    const enquiry = enquiryRepo.create({
      subject,
      message,
      user: req.user ?? null,
    });
    await enquiryRepo.save(enquiry);

    return toJson(res, { data: enquiry });
  } catch (error) {
    return errorResponse(res, error);
  }
};
