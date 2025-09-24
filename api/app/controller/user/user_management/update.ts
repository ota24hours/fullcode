import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, DeleteLocalServerFile, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";
import { FileUploadToLocalServer } from "../../../../utils/file_upload";
import { Point } from "typeorm";

export const updateUserProfile = async (req: Request, res: Response) => {
  let uploadedFileUrl: string = "";
  let uploadedProfileFileUrl: string = "";

  try {

    // 1) Ensure user is authenticated (req.user.id must exist)
    if (!req.user || !req.user.id) {
      throw new Error("Unauthenticated");
    }
    const userId = req.user.id;

    // 2) Fetch existing user
    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { id: userId } });
    if (!existing) {
      throw new Error("User not found");
    }

    // 3) Destructure allowed fields from body
    const {
      name,
      phone,
      email,
      code,
      status,
      age,
      verified,
      verified_by,
      verified_at,
      verified_status,
      user_type,
      pincode,
      thaluk,
      district,
      state,
      country,
      profile_url,
      address,
      gender,
      date_of_birth,
      secodary_name,
      secodary_phone,
       active_status,
    lat, lng,
    gst,
    bank_name,
    branch_name,
    acnt_nmbr,
    ifsc,

    } = req.body;
    const { files } = req;

    if (hasData(files)) {
      if (files || Object.keys(files).length > 0) {
        try {
          uploadedFileUrl = await FileUploadToLocalServer({
            req,
            pathToUpload: "properties",
            fileTypes: [".webp", ".png", ".jpg", ".jpeg", "pdf"],
          });
          uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
        } catch (error: any) {
          DeleteLocalServerFile(uploadedFileUrl);
          return errorResponse(res, error.message);
        }
      }
       if (files || Object.keys(files).length > 0) {
        try {
          uploadedFileUrl = await FileUploadToLocalServer({
            req,
            imageKeyWord:'profile_img',
            pathToUpload: "user_img",
            fileTypes: [".webp", ".png", ".jpg", ".jpeg", "pdf"],
          });
          uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
        } catch (error: any) {
          DeleteLocalServerFile(uploadedFileUrl);
          return errorResponse(res, error.message);
        }
      }
    }

    // 4) Apply updates if present, one by one:

    if (hasData(name)) {
      existing.name = name.trim();
    }
     if (hasData(gst)) {
      existing.gst = gst.trim();
    }


    if (hasData(phone)) {

      existing.phone = phone.trim();

    }



    if (hasData(email)) {

      existing.email = email.trim();

    }

    if (hasData(code)) {

      existing.code = code.trim();

    }
    if (hasData(uploadedFileUrl)) {
      existing.supporting_document = uploadedFileUrl;
    }

    if (hasData(status)) {

      existing.status = cToBooleanSafe(status);
    }

    if (hasData(age)) {

      existing.age = age.trim();
    }
    //Bank Account Details
    if (hasData(bank_name)) {
      existing.bank_name = bank_name.trim();
    }
    if (hasData(branch_name)) {
      existing.branch_name = branch_name.trim();
    }
    if (hasData(ifsc)) {
      existing.ifsc = ifsc.trim();
    }
    if (hasData(acnt_nmbr)) {
      existing.acnt_nmbr = acnt_nmbr.trim();
    }
    // ─── New: update profile image ─────────────────────────────────────────────

    if (hasData(secodary_name)) {
      existing.secodary_name = secodary_name;
    }

    if (hasData(secodary_phone)) {
      existing.secodary_phone = secodary_phone;
    }
    // ─── Verification fields ──────────────────────────────────────────────────
    if (hasData(verified)) {

      existing.verified = cToBooleanSafe(verified);

    }

    if (hasData(verified_by)) {

      existing.verified_by = verified_by.trim();

    }

    if (hasData(verified_at)) {
      const dateVal = new Date(verified_at);

      existing.verified_at = dateVal;
    }

    if (hasData(verified_status)) {
      existing.verified_status = verified_status;
    }

    // ─── USER TYPE ─────────────────────────────────────────────────────────────
    if (hasData(user_type)) {

      existing.user_type = user_type;

    }

    // ─── Address‐related fields ────────────────────────────────────────────────
    if (hasData(pincode)) {

      existing.pincode = pincode.trim();
    }

    if (hasData(thaluk)) {

      existing.thaluk = thaluk.trim();

    }

    if (hasData(district)) {

      existing.district = district.trim();

    }

    if (hasData(state)) {

      existing.state = state.trim();

    }

    if (hasData(country)) {

      existing.country = country.trim();

    }

    if (hasData(profile_url)) {

      existing.profile_url = profile_url.trim();

    }

    if (hasData(address)) {

      existing.address = address.trim();

    }

    // ─── GENDER ─────────────────────────────────────────────────────────────────
    if (hasData(gender)) {

      existing.gender = gender;

    }

    if (hasData(date_of_birth)) {
      // Expecting "YYYY-MM-DD" or any ISO string

      existing.date_of_birth = date_of_birth.trim();

    }

    // 5) Excluded fields: api_key, otp → we do NOT touch them here

if (hasData(active_status)) {
    // assuming active_status is "true"/"false" or boolean
    existing.status = cToBooleanSafe(active_status);
  }

  // ─── New: update geo‐location ────────────────────────────────────
 if (hasData(lat) && hasData(lng)) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      return errorResponse(res, "Invalid latitude or longitude");
    }

    // Build a geojson Point for our transformer
    existing.location = {
      type: "Point",
      coordinates: [lngNum, latNum],
    };
  }


    // 6) Save updated user
    const updated = await userRepo.save(existing);

    // 7) Exclude password in response (or any other sensitive fields)
    const { password: _, ...userWithoutPassword } = updated as any;

    return toJson(res, {
      data: userWithoutPassword,
      message: "User profile updated successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};