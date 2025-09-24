import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus } from "../../../../src/entity/enum";
import { VendorPayment } from "../../../../src/entity/vendor_payment";

export const getVendorSummary = async (req: Request, res: Response) => {
    try {

      let vendorId= req?.user?.id;
        const {  startDate, endDate } = req.query;

        // 1) Validate vendorId
        if (!vendorId) {
            return errorResponse(res, "`vendorId` is required",);
        }

        // 2) Parse & validate optional dates
        let start: Date | undefined, end: Date | undefined;
        if (hasData(startDate)) {
            start = new Date(startDate as string);
            if (isNaN(start.getTime())) {
                return errorResponse(res, "`startDate` is invalid");
            }
        }
        if (hasData(endDate)) {
            end = new Date(endDate as string);
            if (isNaN(end.getTime())) {
                return errorResponse(res, "`endDate` is invalid",);
            }
        }

        // 3) Fetch bookings for this vendor
        const bookingRepo = AppDataSource.getRepository(Booking);
        const qb = bookingRepo
            .createQueryBuilder("b")
            .innerJoinAndSelect("b.variant", "v")
            .innerJoinAndSelect("b.user", "u")
            .innerJoinAndSelect("v.property_id", "p")
            .where("p.user_id = :vendorId", { vendorId });

        if (hasData(start)) {
            qb.andWhere("b.createdAt >= :start", { start });
        }
        if (hasData(end)) {
            qb.andWhere("b.createdAt <= :end", { end });
        }

        const bookings = await qb.getMany();

        // 4) Compute due amount
        interface Breakdown {
            bookingId: string; share: number; bookingDate: Date; user: {
                id: string;
                name: string;
                phone: string;
                secondary_name: string | null;
                secondary_phone: string | null;
                email: string | null;
            };
        }
        const breakdown: Breakdown[] = [];
        let totalDue = 0;
        for (const b of bookings) {
            // Assume your PropertyVariants entity has a `vendorPercentage: number` column:
            const pct = b.variant.percentage ?? 0;
            const share = Number(b.totalAmount) * pct / 100;
            breakdown.push({
                bookingId: b.id,
                share,
                bookingDate: b.startDate,
                user: {
                    id: b.user.id!.toString(),
                    name: b.user.name,
                    phone: b.user.phone,
                    secondary_name: b.user.secodary_name || null,
                    secondary_phone: b.user.secodary_phone || null,
                    email: b.user.email || null,
                },
            });
            totalDue += share;
        }

        // 5) Fetch payments already made in this window
        const payRepo = AppDataSource.getRepository(VendorPayment);
        const payQb = payRepo
            .createQueryBuilder("vp")
            .where("vp.vendor_id = :vendorId", { vendorId });
        if (hasData(start)) {
            payQb.andWhere("vp.createdAt >= :start", { start });
        }
        if (hasData(end)) {
            payQb.andWhere("vp.createdAt <= :end", { end });
        }
        const payments = await payQb.getMany();
        const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

        // 6) Return the summary
        return toJson(res, {
            data: {
                vendorId,
                period: {
                    startDate: start ?? null,
                    endDate: end ?? null,
                },
                totalDue,        // how much they earned in this period
                totalPaid,       // how much you’ve already paid them
                outstanding: totalDue - totalPaid,
                breakdown,       // optional per‐booking detail
                payments,        // optional raw payment records
            },
        });
    } catch (err: any) {
        console.error("Error fetching vendor earnings:", err);
        return errorResponse(res, `Internal server error${err.message}`);
    }
};