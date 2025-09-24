// import { Request, Response } from "express";
// import { errorResponse, toJson } from "node_custom_utils";
// import { Admin } from "../src/entity/User";
// import { hashPassword } from "./utilities";
// import { AppDataSource } from "../src/data-source";

// export const DefaultAdmin = async (req: Request, res: Response) => {
//   try {
//     const admin = new Admin();
//     admin.id = "1";
//     admin.Admin_name = "Frs";
//     admin.status = true;
//     admin.phone = "8111955289";
//     admin.password = await hashPassword("admin@123");
//     admin.is_super_admin = true;

//     await AppDataSource.getRepository(Admin).upsert(admin, ["id"]);
//     return toJson(res, {
//       data: {
//         message: "Default Admin created",
//       },
//     });
//   } catch (error) {
//     return errorResponse(res, error);
//   }
// };
