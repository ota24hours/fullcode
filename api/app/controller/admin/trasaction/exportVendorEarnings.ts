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
import { Sub_Category } from "../../../../src/entity/sub_category";
import { VendorPayment } from "../../../../src/entity/vendor_payment";
import * as ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Booking } from "../../../../src/entity/booking";


export const exportVendorPayments = async (req: Request, res: Response) => {
    try {
        // Extract optional filters
        const { vendorId, fromDate, toDate } = req.query;

        // Build query without pagination
        const qb = AppDataSource.getRepository(VendorPayment)
            .createQueryBuilder("vp")
            .leftJoinAndSelect("vp.vendor", "v")
            .orderBy("vp.createdAt", "DESC");

        if (vendorId) {
            qb.andWhere("v.id = :vendorId", { vendorId: String(vendorId) });
        }
        if (fromDate && toDate) {
            const from = new Date(fromDate as string);
            const to = new Date(toDate as string);
            if (isNaN(from.getTime()) || isNaN(to.getTime())) {
                throw new Error("Invalid dates: 'fromDate' and 'toDate' must be valid ISO dates.");
            }
            qb.andWhere("vp.createdAt BETWEEN :from AND :to", { from, to });
        }

        const payments = await qb.getMany();
        // 1) Calculate total earnings from bookings in the period
        const bookingRepo = AppDataSource.getRepository(Booking);
        const bookingQb = bookingRepo
            .createQueryBuilder('b')
            .leftJoinAndSelect('b.variant', 'v')
            .leftJoinAndSelect('v.property_id', 'p');

            if(hasData(vendorId)) {
            bookingQb.andWhere('p.user_id = :vendorId', { vendorId });
        }
    
        if (fromDate) bookingQb.andWhere('b.createdAt >= :start', { fromDate });
        if (toDate) bookingQb.andWhere('b.createdAt <= :end', { toDate });

        const bookings = await bookingQb.getMany();
        const totalEarned = bookings.reduce((sum, b) => {
            const pct = b.variant.percentage ?? 0;
            return sum + (Number((b as any).totalAmount) * pct) / 100;
        }, 0);



        // Create Excel workbook and sheet
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Vendor Payments");

        // Define columns with readable date format and additional amount fields
        sheet.columns = [
            { header: "Payment ID", key: "id", width: 20 },
            { header: "Vendor ID", key: "vendorId", width: 20 },
            { header: "Vendor Name", key: "vendorName", width: 30 },
            { header: "Vendor Phone", key: "vendorPhone", width: 20 },
            { header: "Due Amount", key: "dueAmount", width: 15 },
            { header: "Given Amount", key: "givenAmount", width: 15 },
            { header: "Note", key: "note", width: 30 },
            { header: "Date", key: "createdAt", width: 20, style: { numFmt: 'dd-mmm-yyyy hh:mm:ss' } },
        ];
        let runningPaid = 0;
        // Populate rows
        payments.forEach((p) => {
            runningPaid += Number(p.amount);
            const dueAfter = totalEarned - runningPaid;
            sheet.addRow({
                id: p.id,
                vendorId: p.vendor.id,
                vendorName: p.vendor.name,
                vendorPhone: p.vendor.phone,
                dueAmount: (p as any).dueAmount ?? 0,    // assumes `dueAmount` field exists on entity
                givenAmount: p.amount,
                note: p.note || '',
                createdAt: p.createdAt, // ExcelJS will apply the date format
            });
        });
        const BASE_URL = process.env.BASE_URL;


        const fileName = `vendor_management${uuidv4()}.xlsx`;
        const outDir = path.join(__dirname, "../../../../excels");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const fullPath = path.join(outDir, fileName);
        await workbook.xlsx.writeFile(fullPath);
        const publicUrl = `${BASE_URL}/excels/${fileName}`;

        return toJson(res, {
            data: publicUrl,
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};


