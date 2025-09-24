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
import { User } from "../../src/entity/user";

export const UserAuthValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Extract API key from headers
    const apiKey = getApiKey(req);
    if (!hasData(apiKey)) {
      throw new Error("Authorization is required for this action");
    }

    // 2) Decode and validate the token
    const tokenData = tokenAuthDecode(apiKey);
    if (tokenData.error) {
      throw new Error("You need a valid Authorization to proceed.");
    }

    // 3) tokenData.value.data should be the user's ID
    const userId = tokenData.value.data;
    if (!hasData(userId)) {
      throw new Error("Invalid token payload");
    }

    // 4) Query the User table (exclude password)
    const raw = await AppDataSource.getRepository(User)
      .createQueryBuilder("u")
      .select("u.id", "id")
      .addSelect("u.name", "name")
      .addSelect("u.phone", "phone")
      .addSelect("u.email", "email")
      .addSelect("u.code", "code")
      .addSelect("u.status", "status")
      .addSelect("u.age", "age")
      .addSelect("u.user_type", "user_type")
      .addSelect("u.pincode", "pincode")
      .addSelect("u.thaluk", "thaluk")
      .addSelect("u.district", "district")
      .addSelect("u.state", "state")
      .addSelect("u.country", "country")
      .addSelect("u.otp", "otp")
      .addSelect("u.api_key", "api_key")
      .addSelect("u.fcm_token", "fcm_token")
      .addSelect("u.profile_url", "profile_url")
      .addSelect("u.address", "address")
      .addSelect("u.gender", "gender")
      .addSelect("u.date_of_birth", "date_of_birth")
      .addSelect("u.createdAt", "createdAt")
      .addSelect("u.updatedAt", "updatedAt")
      .where("u.id = :id", { id: userId })
      .getRawOne();

    // 5) If no user is found, reject
    if (!raw) {
      throw new Error("Invalid user");
    }

    // 6) Check if account is active
    if (!cToBooleanSafe(raw.status)) {
      throw new Error("This account is presently inactive.");
    }

    // 7) Assemble the profile object
    const profile: any = {
      id: raw.id,
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      code: raw.code,
      status: raw.status,
      age: raw.age,
      user_type: raw.user_type,
      pincode: raw.pincode,
      thaluk: raw.thaluk,
      district: raw.district,
      state: raw.state,
      country: raw.country,
      otp: raw.otp,
      api_key: raw.api_key,
      fcm_token: raw.fcm_token,
      profile_url: raw.profile_url,
      address: raw.address,
      gender: raw.gender,
      date_of_birth: raw.date_of_birth,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    // 8) Attach to req.user and proceed
    req.user = profile;
    return next();
  } catch (error) {
    return errorResponse(res, error);
  }
};