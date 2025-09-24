import { NextFunction, Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  getApiKey,
  hasData,
  toJson,
} from "node_custom_utils";
import { tokenAuthDecode } from "../../utils/jwt_utls";
import { AppDataSource } from "../../src/data_source/data_source";
import { Admin } from "../../src/entity/admin";

export const AdminAuthValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Extract API key from headers (e.g. Authorization: Bearer <token>)
    const apiKey = getApiKey(req);
    if (!hasData(apiKey)) {
      throw new Error("Authorization is required for this action");
    }

    // 2) Decode and validate the token
    const tokenData = tokenAuthDecode(apiKey);
    if (tokenData.error) {
      throw new Error("You need a valid Authorization to proceed.");
    }

    // 3) tokenData.value.data should be the admin's ID
    const adminId = tokenData.value.data;
    if (!hasData(adminId)) {
      throw new Error("Invalid token payload");
    }

    // 4) Query the Admin table (exclude password), and build a JSON object for 'createdBy' if present
    const raw = await AppDataSource.getRepository(Admin)
      .createQueryBuilder("a")
      .leftJoin("a.createdBy", "cr")
      .select("a.id", "id")
      .addSelect("a.user_name", "user_name")
      .addSelect("a.name", "name")
      .addSelect("a.phone_no", "phone_no")
      .addSelect("a.apiKey", "apiKey")
      .addSelect("a.status", "status")
      .addSelect("a.is_super_admin", "is_super_admin")
      .addSelect("a.api_key", "api_key")
      .addSelect("a.gender", "gender")
      .addSelect("a.createdAt", "createdAt")
      .addSelect("a.updatedAt", "updatedAt")
      .addSelect(
        `CASE
           WHEN cr.id IS NULL THEN NULL
           ELSE JSON_OBJECT(
             'id',           CAST(cr.id AS CHAR),
             'user_name',    cr.user_name,
             'name',         cr.name,
             'phone_no',     cr.phone_no,
             'apiKey',       cr.apiKey,
             'status',       cr.status,
             'is_super_admin', cr.is_super_admin,
             'api_key',      cr.api_key,
             'gender',       cr.gender,
             'createdAt',    DATE_FORMAT(cr.createdAt, '%Y-%m-%dT%H:%i:%s.000Z'),
             'updatedAt',    DATE_FORMAT(cr.updatedAt, '%Y-%m-%dT%H:%i:%s.000Z')
           )
         END`,
        "created_by"
      )
      .where("a.id = :id", { id: adminId })
      .getRawOne();

    // 5) If no admin is found, reject
    if (!raw) {
      throw new Error("Invalid user");
    }

    // 6) Check if account is active
    if (!cToBooleanSafe(raw.status)) {
      throw new Error(
        "This account is presently inactive. Kindly reach out to the administrator."
      );
    }

    // 7) Assemble the profile object
    const profile: any = {
      id: raw.id,
      user_name: raw.user_name,
      name: raw.name,
      phone_no: raw.phone_no,
      apiKey: raw.apiKey,
      status: raw.status,
      is_super_admin: raw.is_super_admin,
      api_key: raw.api_key,
      gender: raw.gender,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      createdBy: raw.created_by ? JSON.parse(raw.created_by) : null,
    };

    // 8) Attach to req.admin and proceed
    req.admin = profile;
    return next();
  } catch (error) {
    return errorResponse(res, error);
  }
};