import * as express from "express";
import * as http from "http";

import * as fileUpload from "express-fileupload";
import * as cors from "cors";
import { cToBooleanSafe, toJson } from "node_custom_utils";
import { Request, Response } from "express";
// import UserRouter from "./app/routes/User/Admin";

import path = require("path");
import { AppDataSource } from "./src/data_source/data_source";
import UserRouter from "./app/routes/user/user";
import { Admin } from "./src/entity/admin";
import { User } from "./src/entity/user";
import AdminRouter from "./app/routes/admin/loginRouter";
import AdminUserRouter from "./app/routes/admin/userRouter";
import { hashPassword } from "./utils/utilities";
import CategoryRouter from "./app/routes/admin/categoryRouter";
import SubCategoryRouter from "./app/routes/admin/sub_categoryRouter";
import CategoryUserRouter from "./app/routes/user/category";
import subCategoryUserRouter from "./app/routes/user/sub_category_router";
import PropertyAdminRouter from "./app/routes/admin/propertiesRouter";
import PropertyUserRouter from "./app/routes/user/propertiesRouter";
import bookingUserRouter from "./app/routes/user/booking_router";
import bookingAdminRouter from "./app/routes/admin/bookingAdminRouter";
import propertyTransactionRouter from "./app/routes/user/transaction_router";
import generalEnquiryUserRouter from "./app/routes/user/general_enquiry";
import replayUserRouter from "./app/routes/user/dispiute_management";
import CustomizableRouter from "./app/routes/admin/customizableRouter";
import CustomizableUserRouter from "./app/routes/user/customizableRouterUser";
import reviewRouter from "./app/routes/user/reviewRouter";
import TransactionAdminRouter from "./app/routes/admin/transactionAdminRouter";



require("dotenv").config();

//─────────────────────────────── oms ───────────────────────────────
// Initialized for saving user infos
declare module "express" {
  interface Request {
    admin?: Admin | undefined;
    user?: User | undefined;
  }
}
//─────────────────────────────── oms ───────────────────────────────
AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(fileUpload());
    
    // Configure CORS
    const corsOptions = {
      origin: [
        'https://ota24hours.com',
        'https://admin.ota24hours.com',
        'http://localhost:4200',
        'http://localhost:4201'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400 // 24 hours
    };
    app.use(cors(corsOptions));
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    const server = http.createServer(app);

    app.use(express.static("view"));

    // app.get("/", (_req: Request, res: Response) => {
    //   return res.sendFile(path.join(__dirname + "/view/index.html"));
    // });

    app.use("/img", express.static("public"));
    app.use("/excels", express.static("excels"));
    app.use("/pdfs", express.static("pdfs"));

    //─────────────────────────────── frs ───────────────────────────────

    // User
    app.use("/user", UserRouter);
    app.use("/user/category", CategoryUserRouter);
    app.use("/user/sub_category", subCategoryUserRouter);
    app.use("/user/properties", PropertyUserRouter);
    app.use("/user/booking", bookingUserRouter);
    app.use("/user/transactions", propertyTransactionRouter);
    app.use("/user/general_enquiry", generalEnquiryUserRouter);
    app.use("/user/dispute_management", replayUserRouter);
    app.use("/user/user_customizable", CustomizableUserRouter);
    app.use("/user/review", reviewRouter);

    //Admin
    app.use("/admin", AdminRouter);
    app.use("/admin/user", AdminUserRouter);
    app.use("/admin/category", CategoryRouter);
    app.use("/admin/sub_category", SubCategoryRouter);
    app.use("/admin/property", PropertyAdminRouter);
    app.use("/admin/booking", bookingAdminRouter);
    app.use("/admin/customize", CustomizableRouter);
    app.use("/admin/vendor", TransactionAdminRouter);

    //─────────────────────────────── Frs ───────────────────────────────

    // For dev use
    app.get("/restart", (req: Request, res: Response) => {
      process.exit(1);
    });



    app.get("/init", async (req: Request, res: Response) => {
      try {
        const admin = new Admin();
        admin.id = "1";
        admin.user_name = "super_admin";
        admin.status = true;
        admin.password = await hashPassword("admin@123");
        admin.is_super_admin = cToBooleanSafe(true);

        let insertedUser = await AppDataSource.manager.save(Admin, admin);
      } catch (error) {
        console.log(error);
      }
      return toJson(res, {});
    });

    // app.use(function (_req: Request, res: Response) {
    //   return res.redirect("/");
    // });
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'view', 'index.html'));
    });
    //─────────────────────────────── Frs ───────────────────────────────
    server.listen(5000, () => {
      console.log("listening on *:5000");
      console.log("SERVER STARTED AT", new Date().toISOString());
    });
  })

  .catch((err) => {
    console.log("Server Error", err);
  });
