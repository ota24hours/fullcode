import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // 1) Ensure req.user is populated by your auth middleware
    if (!req.user || !req.user.id) {
      throw new Error("Unauthenticated");
    }

    // 2) Fetch fresh user data along with supporting documents
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo
      .createQueryBuilder("u")
      // join on your defined property name
      .leftJoinAndSelect("u.user_support_docs", "usd")
      .select([
        "u.id",
        "u.name",
        "u.phone",
        "u.email",
        "u.code",
        "u.status",
        "u.age",
        "u.verified",
        "u.verified_by",
        "u.verified_at",
        "u.verified_status",
        "u.user_type",
        "u.pincode",
        "u.thaluk",
        "u.district",
        "u.state",
        "u.country",
        "u.profile_url",
        "u.address",
        "u.gender",
        "u.date_of_birth",
        "u.createdAt",
        "u.updatedAt",
        "u.secodary_name",
        "u.secodary_phone",
        "u.gst",
        "u.bank_name",
        "u.branch_name",
        "u.ifsc",
        "u.acnt_nmbr",
        // Include all fields from user_support_docs
        // supporting docs fields
        "usd.id",
        "usd.doc_type",
        "usd.doc_one",
        "usd.expiry_date",
        "usd.createdAt",
        "usd.updatedAt",
      ])
      .where("u.id = :id", { id: req.user.id })
      .getOne();

    if (!user) {
      throw new Error("User not found");
    }

    const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL?.replace(/\/+$/, "") ?? "";

    // Prefix profile_url if present
    if (user.profile_url) {
      const slash = user.profile_url.startsWith('/') ? '' : '/';
      user.profile_url = `${IMAGE_BASE_URL}${slash}${user.profile_url}`;
    }

    // Prefix each supporting doc's doc_one
    if (Array.isArray(user.user_support_docs)) {
      user.user_support_docs = user.user_support_docs.map(doc => {
        if (doc.doc_one) {
          const slash = doc.doc_one.startsWith('/') ? '' : '/';
          doc.doc_one = `${IMAGE_BASE_URL}${slash}${doc.doc_one}`;
        }
        return doc;
      });
    }

    // 3) Return the user with prefixed image URLs
    return toJson(res, { data: user });
  } catch (error: any) {
    return errorResponse(res, error.message || error);
  }
};

