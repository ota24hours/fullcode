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
const PDFDocument = require('pdfkit'); // ← here
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";


export const createVendorPayment = async (req: Request, res: Response) => {
  try {
    const { vendorId, amount, note } = req.body;
    if (!amount) throw new Error("`amount` is required");

    let userEntity: User | null = null;
    if (hasData(vendorId)) {
      // parse as integer if cat_id was sent as string:
      userEntity = await AppDataSource.getRepository(User).findOne({
        where: { id: vendorId },
      });
      if (!userEntity) {
        throw new Error(`User with id=${vendorId} not found.`);
      }
    }

    const repo = AppDataSource.getRepository(VendorPayment);
    const payment = repo.create({
      vendor: userEntity,
      amount,
      note: note ?? null,
    });
    const saved = await repo.save(payment);

    /// Paymnet PDF Generation
    // 3) Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4) Company info
    const COMPANY_NAME = "Online Travel Agent 24 Hours";
    const COMPANY_ADDRESS = "Nazarth Church Road, Kumarakom PO, ";
    const COMPANY_ADDRESS_TWO = "Kottayam 686563, Kerala, India";
    const COMPANY_CONTACT = "+91 9633926023";
    const COMPANY_EMAIL = "mail@ota24hours.com";
    const COMPANY_WEBSITE = "www.ota24hours.com";
    const COMPANY_LOGO_URL =
      "https://admin.ota24hours.com/assets/img/logo-2.jpg";
    const BASE_URL = process.env.BASE_URL || "";

    // 5) Build PDF
    // 1) Choose a dedicated `pdfs` folder (not “excels”)
const outDir  = path.join(__dirname, '../../../../pdfs');

// 2) Build just the filename
const fileName = `vendor-payment-${uuidv4()}.pdf`;

// 3) Ensure the folder exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// convert to number once:
const amt = typeof saved.amount === 'string'
  ? parseFloat(saved.amount)
  : saved.amount;

// 4) Join folder + filename exactly once
const fullPath = path.join(outDir, fileName);
    const stream = fs.createWriteStream(fullPath);
    //Pdf Starts Here
     // 2) Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(stream);

    // 3) Header Section
    // — Company logo + name
    try {
      const resp = await axios.get(COMPANY_LOGO_URL, { responseType: 'arraybuffer' });
      const logoBuffer = Buffer.from(resp.data, 'binary');
      doc.image(logoBuffer, 50, 45, { width: 60 });
    } catch {
      /* ignore missing logo */
    }
   // Company details
    let y = 50;
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#333')
      .text(COMPANY_NAME, 120, y);
    y += 30;
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#000')
      .text(COMPANY_ADDRESS, 120, y)
      .text(COMPANY_ADDRESS_TWO, 120, y + 12);
    y += 28;
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#555')
      .text(`Phone:   ${COMPANY_CONTACT}`, 120, y)
      .text(`Email:   ${COMPANY_EMAIL}`,    120, y + 12)
      .text(`Website: ${COMPANY_WEBSITE}`,  120, y + 24);

    // Invoice title & metadata
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#000')
      .text('INVOICE', 400, 50, { align: 'right' });
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`Invoice #: ${saved.id}`, { align: 'right' })
      .text(`Date: ${saved.createdAt.toLocaleDateString()}`, { align: 'right' });

    // Horizontal rule
    doc
      .strokeColor('#AAAAAA')
      .lineWidth(1)
      .moveTo(50, 160)
      .lineTo(550, 160)
      .stroke();

    // Billing info
    y = 180;
    const leftX = 50;
    const rightX = 300;

    // From
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#333')
      .text('From:', leftX, y);
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#000')
      .text(COMPANY_NAME, leftX, y + 15)
      .text(COMPANY_ADDRESS, leftX, y + 30)
      .text(COMPANY_ADDRESS_TWO, leftX, y + 45)
      .text(`Phone: ${COMPANY_CONTACT}`, leftX, y + 60);

    // To
    doc
      .font('Helvetica-Bold')
      .text('Bill To:', rightX, y);
    if (userEntity) {
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#000')
        .text(userEntity.name, rightX, y + 15)
        .text(userEntity.address || '–', rightX, y + 30)
        .text(`Phone: ${userEntity.phone}`, rightX, y + 45);
      if (userEntity.gst) doc.text(`GST: ${userEntity.gst}`, rightX, y + 60);
    } else {
      doc
        .font('Helvetica')
        .fontSize(10)
        .text('–', rightX, y + 15);
    }

    // Items table
    y = 270;
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#333')
      .text('Description', leftX, y)
      .text('Amount (INR)', 450, y, { width: 90, align: 'right' });
    doc
      .strokeColor('#CCCCCC')
      .lineWidth(1)
      .moveTo(leftX, y + 15)
      .lineTo(550, y + 15)
      .stroke();

    // Single item
    y += 25;
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#000')
      .text('Vendor Payment', leftX, y)
      .text(amt.toFixed(2), 450, y, { width: 90, align: 'right' });

    // Total
    y += 40;
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#333')
      .text('Total:', 350, y, { continued: true })
      .text(`INR ${amt.toFixed(2)}`, { align: 'right' });

    // OTP & Note
    y += 40;
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('One-Time Code:', leftX, y)
      .font('Helvetica')
      .text(otp, leftX + 100, y);
    if (saved.note) {
      y += 20;
      doc
        .font('Helvetica-Bold')
        .text('Note:', leftX, y)
        .font('Helvetica')
        .text(saved.note, leftX + 50, y, { width: 450 });
    }

    // Footer
    doc
      .fontSize(9)
      .fillColor('#888')
      .text(
        'Thank you for your business! Payment due within 7 days.',
        50,
        780,
        { align: 'center', width: 500 }
      );

    // Finalize
    doc.end();
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });




    // 6) Update record with URL
    saved.pdf_url = `${BASE_URL}/pdfs/${fileName}`;
    await repo.save(saved);


    return toJson(res, { data: saved, message: "Payment recorded" });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};
