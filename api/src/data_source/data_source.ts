import { DataSource } from "typeorm";
import "reflect-metadata";
import { Admin } from "../entity/admin";
import { User } from "../entity/user";
import { Sub_Category } from "../entity/sub_category";
import { Category } from "../entity/category";
import { UserSelectCategories } from "../entity/user_select_categories";
import { Property } from "../entity/properties";
import { PropertyImgs } from "../entity/properties_imgs";
import { Booking } from "../entity/booking";
import { PropertyVariants } from "../entity/property_veriants";
import { BookingRequest } from "../entity/booking_request";
import { CommissionPayment } from "../entity/commision_payment";
import { BookingDispute } from "../entity/booking_dispute";
import { DisputeReply } from "../entity/dispute_replay";
import { GeneralEnquiry } from "../entity/general_enquiry";
import { EnquiryReply } from "../entity/enquiry_replay";
import { CustomizableItem } from "../entity/customizable_items";
import { Review } from "../entity/reviews";
import { UserSupportingDocuments } from "../entity/user_supporting_docs";
import { PropertyPricingVariants } from "../entity/pricing_variants";
import { VendorPayment } from "../entity/vendor_payment";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),

  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "travel_log",

  synchronize: true,
  logging: true,
  entities: [
    Admin,
    User,
    Category,
    Sub_Category,
    UserSelectCategories,
    Property,
    PropertyImgs,
    Booking,
    PropertyVariants,
    BookingRequest,
    CommissionPayment,
    BookingDispute,
    DisputeReply,
    GeneralEnquiry,
    EnquiryReply,
    CustomizableItem,
    Review,
    UserSupportingDocuments,
    PropertyPricingVariants,
    VendorPayment
  ],
  migrations: [],
  subscribers: [],
});