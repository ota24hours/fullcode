import { Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Admin } from "../../../../src/entity/admin";
import { comparePassword, hashPassword, tokenEncode } from "../../../../utils/utilities";

export const GetAdminProfile = async (req: Request, res: Response) => {
  try {
    // 1) Ensure the caller is authenticated
    const adminData = req.admin;
    if (!adminData?.id) {
      throw new Error("Admin not authenticated");
    }

    // 2) Fetch the Admin record from the database (excluding password)
    //    and include the createdBy relation if it exists
    const adminRepo = AppDataSource.getRepository(Admin);
    const admin = await adminRepo.findOne({
      where: { id: adminData.id },
      select: [
        "id",
        "user_name",
        "name",
        "phone_no",
        "apiKey",
        "status",
        "is_super_admin",
        "api_key",
        "gender",
        "createdAt",
        "updatedAt",
      ],
      relations: ["createdBy"],
    });

    if (!admin) {
      throw new Error("Admin profile not found");
    }

    // 3) Return profile data (omit password)
    toJson(res, { data: admin });
  } catch (error) {
    errorResponse(res, error);
  }
};