import 'dotenv/config';      // <-- Add this as the very first import

import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus, PaymentType, PropertyType } from "../../../../src/entity/enum";
import { PropertyVariants } from "../../../../src/entity/property_veriants";
import Razorpay = require('razorpay');
import { BookingRequest } from "../../../../src/entity/booking_request";
import { parseDMY } from '../../../../utils/utilities';


// ② Immediately verify that the env vars are present:
const { RAZOR_KEY_ID, RAZOR_KEY_SECRET } = process.env;
if (!RAZOR_KEY_ID || !RAZOR_KEY_SECRET) {
  console.error("❌ RAZOR_KEY_ID or RAZOR_KEY_SECRET is missing!");
  console.error("   RAZOR_KEY_ID =", RAZOR_KEY_ID);
  console.error("   RAZOR_KEY_SECRET =", RAZOR_KEY_SECRET);
  process.exit(1);
}

// ③ Only after that instantiate Razorpay:
const razorpay = new Razorpay({
  key_id: RAZOR_KEY_ID,
  key_secret: RAZOR_KEY_SECRET,
});

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      variantId,
      startDate,
      endDate,
      unitsBooked,
      extraBeds = 0,
      distanceKm,
      paymentType  // only for TRANSPORTATION
    } = req.body;

    // 1) Basic validation
    if (![variantId, startDate, endDate, unitsBooked].every(hasData)) {
      throw new Error('variantId, startDate, endDate and unitsBooked are required.');
    }
    const sDate = parseDMY(startDate);
    const eDate = parseDMY(endDate);

    // 2) Load variant + its pricing‑variants + property
    const variantRepo = AppDataSource.getRepository(PropertyVariants);
    const variant = await variantRepo.findOne({
      where: { id: String(variantId) },
      relations: ['property_id', 'propertyPricing']
    });
    if (!variant) throw new Error(`Variant ${variantId} not found.`);
    const property = variant.property_id;

    // 3) Determine the applicable per‑unit (or per‑km) rate:
    const now = new Date();
    const activePrice = variant.propertyPricing?.find(pr =>
      pr.isActive
      && new Date(pr.startDate) <= now
      && now <= new Date(pr.endDate)
    );
    // fallback to the variant’s own rate if no pricing‐variant applies
    const rate = activePrice
      ? Number(activePrice.rate)
      : Number(variant.rate);



    // 4) Availability check (reuse your existing query)
    const bookingRepo = AppDataSource.getRepository(Booking);
    const { bookedUnits } = await bookingRepo
      .createQueryBuilder('b')
      .select('SUM(b.unitsBooked)', 'bookedUnits')
      .where('b.variant = :vid', { vid: variantId })
      .andWhere('b.status IN (:...st)', {
        st: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]
      })
      .andWhere('b.startDate < :eDate AND b.endDate > :sDate', { sDate, eDate })
      .getRawOne<{ bookedUnits: string | null }>();

    const alreadyBooked = bookedUnits ? parseInt(bookedUnits, 10) : 0;
    const availableUnits = variant.total_units_available - alreadyBooked;
    const requested = Number(unitsBooked);
    if (requested > availableUnits) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableUnits} unit(s) available for these dates.`
      });
    }

    // 5) Compute base amount
    let baseAmount: number;
    if (property.propertyType === PropertyType.TRANSPORTSTION) {
      if (!hasData(distanceKm) || isNaN(Number(distanceKm))) {
        throw new Error('distanceKm is required for vehicle bookings.');
      }
      // use per‑km rate
      baseAmount = rate * Number(distanceKm);
    } else {
      // nights = ceil((end – start) / 1 day)
      const msPerDay = 1000 * 60 * 60 * 24;
      const nights = Math.ceil((eDate.getTime() - sDate.getTime()) / msPerDay);
      baseAmount = nights * rate * requested;

    }

    // 6) Extras (extra beds) — FIXED to guard against NaN
    const extraBedRate = Number(variant.rate_for_extra_bed ?? 0);
    const extrasAmount = variant.extra_bed_available
      ? extraBedRate * Number(extraBeds)
      : 0;

    // 7) Tax – assume variant.tax is a percentage
    const taxable = baseAmount + extrasAmount;
    const taxAmount = Number((taxable * (Number(variant.tax) / 100)).toFixed(2));

    // 8) Grand total
    const totalAmount = Number((taxable + taxAmount).toFixed(2));

    // 🚨 Guard against NaN before persisting
    if ([baseAmount, extrasAmount, taxAmount, totalAmount].some(isNaN)) {
      throw new Error(`Booking calculation failed – one of the computed amounts was invalid. ${baseAmount}, ${extrasAmount}, ${taxAmount}, ${totalAmount}, ${activePrice?.rate}`);
    }
  
        const booking: Booking = new Booking();

    booking.user = req?.user;
    booking.property = variant.property_id;
    booking.variant = variant;
    booking.startDate = sDate;
    booking.endDate = eDate;
    booking.unitsBooked = requested;
    booking.baseAmount = baseAmount;
    booking.extrasAmount = extrasAmount;
    booking.taxAmount = taxAmount;
    booking.totalAmount = totalAmount;
    booking.paymentType = paymentType;
    booking.status = BookingStatus.PENDING;

    let inserted = await AppDataSource.manager.save(booking);

    let order: any = null;
    if (paymentType !== PaymentType.ONLINE) {
      // order = await razorpay.orders.create({
      //   amount: Math.round(totalAmount * 100),
      //   currency: 'INR',
      //   receipt: `bkreq_${savedReq.id}`,
      // });

      inserted.paymentOrderId = 'bkreq_' + inserted.id;
      inserted = await AppDataSource.manager.save(booking);
    }

   return toJson(res, {
      data: inserted,
    });

  } catch (err: any) {
    return errorResponse(res, err.message ?? err);
  }
};