import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus, PaymentType } from "../../../../src/entity/enum";
import { PropertyVariants } from "../../../../src/entity/property_veriants";
import Razorpay = require('razorpay');
import { BookingRequest } from "../../../../src/entity/booking_request";
import * as crypto from "crypto";
export const razorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = JSON.stringify(req.body);

  // 1) Verify signature
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  if (expected !== signature) {
    return res.status(400).send('Invalid signature');
  }

  // 2) Only act on payment.captured events
  const event = req.body.event;
  if (event !== 'payment.captured') {
    return res.status(200).send('ignored');
  }

  // 3) Look up the BookingRequest
  const orderId = req.body.payload.payment.entity.order_id;
  const brRepo = AppDataSource.getRepository(BookingRequest);
  const br = await brRepo.findOne({
    where: { paymentOrderId: orderId },
    relations: ['property', 'variant', 'user']
  });
  if (!br) {
    return res.status(404).send('BookingRequest not found');
  }

  // 4) Final availability check (same logic)
  //    … if unavailable, you could refund here …

  // 5) Create real Booking
  const bookingRepo = AppDataSource.getRepository(Booking);
  const booking = bookingRepo.create({
    user:         br.user,
    property:     br.property,
    variant:      br.variant,
    startDate:    br.startDate,
    endDate:      br.endDate,
    unitsBooked:  br.unitsBooked,
    baseAmount:   br.baseAmount,
    extrasAmount: br.extrasAmount,
    taxAmount:    br.taxAmount,
    totalAmount:  br.totalAmount,
    status:       BookingStatus.CONFIRMED,
    paymentOrderId: br.paymentOrderId,
  });
  await bookingRepo.save(booking);

  // 6) Remove the request record
  await brRepo.remove(br);

  return res.status(200).send('Booking confirmed');
};