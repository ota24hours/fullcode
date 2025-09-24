import { Request, Response } from "express";
import {
  cToBooleanSafe,
  DeleteLocalServerFile,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Property } from "../../../../src/entity/properties";
import { Category } from "../../../../src/entity/category";
import { Sub_Category } from "../../../../src/entity/sub_category";
import { FileUploadToLocalServer } from "../../../../utils/file_upload";
import { BoatType } from "../../../../src/entity/enum";

export const createUserProperty = async (req: Request, res: Response) => {
      let uploadedFileUrl: string = "";
  try {
    const {
      propertyType,
      name,
      description,
      rate,
      isActive,
      capacity,
      cat_id,
      sub_cat_id,
      // Vehicle‐specific
      make,
      model,
      registrationNumber,
      transmission,
      // Room‐specific
      roomNumber,
      bedCount,
      amenities,
      hasBreakfastIncluded,
      // Houseboat‐specific
      boatName,
      boatRegistrationNo,
      hasDiningFacility,
      // Special Event‐specific 
      eventStartDate,
      eventEndDate,
      eventLocation,
      // Property 
      percentage,
      latitude,
      longitude,

      totalUnits,
      trade_name,

      /// NEw fields
      place,
      district,
      state,
      pincode,

      // New fields end
      Included,
      distances,
      nearby_attractions,
      boat_type,
      termsAndConditions
      
    } = req.body;
    const { files } = req;
    if(hasData(files)) {
     if (files || Object.keys(files).length > 0) {
      try {
        uploadedFileUrl = await FileUploadToLocalServer({
          req,
          pathToUpload: "properties",
          fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
        });
         uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
      } catch (error: any) {
        DeleteLocalServerFile(uploadedFileUrl);
        return errorResponse(res, error.message);
      }
    }
  }
    // ─── Validate required fields ────────────────────────────────────────────
    if (!hasData(propertyType)) {
      throw new Error("`propertyType` is required and must be one of the enum values.");
    }
    if (!hasData(name) || typeof name !== "string" || !name.trim()) {
      throw new Error("`name` is required and must be a non-empty string.");
    }
  

    // ─── (Optional) Validate enum value for propertyType ─────────────────────
    // Assuming PropertyType is an actual TS/JS enum or union of strings
  
    // ─── Load Category & Subcategory if provided ─────────────────────────────
    let categoryEntity: Category | null = null;
    if (hasData(cat_id)) {
      categoryEntity = await AppDataSource.getRepository(Category).findOne({
        where: { id: String(cat_id) },
      });
      if (!categoryEntity) {
        throw new Error(`Category with id=${cat_id} not found.`);
      }
    }

    let subCategoryEntity: Sub_Category | null = null;
    if (hasData(sub_cat_id)) {
      subCategoryEntity = await AppDataSource.getRepository(Sub_Category).findOne({
        where: { id: String(sub_cat_id) },
      });
      if (!subCategoryEntity) {
        throw new Error(`Sub_Category with id=${sub_cat_id} not found.`);
      }
    }

   

    // ─── Create new Property instance ──────────────────────────────────
    const newProp = new Property();
    newProp.propertyType        = propertyType;
    newProp.name                = name.trim();
    newProp.image               = uploadedFileUrl || null;
    newProp.description         = hasData(description) ? (description as string).trim() : null;
    newProp.rate                = safeNumber(rate);
    newProp.isActive            = cToBooleanSafe(isActive);
    newProp.capacity            = safeNumber(capacity);
    newProp.cat_id              = categoryEntity;
    newProp.sub_cat_id          = subCategoryEntity;
    // newProp.percentage          = safeNumber(percentage);
    newProp.latitude            = safeNumber(latitude);
    newProp.longitude           = safeNumber(longitude);
    newProp.totalUnits          = safeNumber(totalUnits);
    newProp.user_id             = req.user; // from auth middleware

    // ─── Vehicle‐specific ─────────────────────────────────────────────
    newProp.make                = hasData(make) ? (make as string).trim() : null;
    newProp.model               = hasData(model) ? (model as string).trim() : null;
    ///Here
    newProp.place               = hasData(place) ? (place as string).trim() : null;
    newProp.district               = hasData(district) ? (district as string).trim() : null;
    newProp.state               = hasData(state) ? (state as string).trim() : null;
    newProp.pincode               = hasData(pincode) ? (pincode as string).trim() : null;

    ///Stop
    newProp.registrationNumber  = hasData(registrationNumber) ? (registrationNumber as string).trim() : null;
    newProp.transmission        = hasData(transmission) ? (transmission as string).trim() : null;

    // ─── Room‐specific ────────────────────────────────────────────────
    newProp.roomNumber          = hasData(roomNumber) ? (roomNumber as string).trim() : null;
    newProp.bedCount            = safeNumber(bedCount);
    newProp.trade_name            = (trade_name);
    newProp.amenities           = Array.isArray(amenities)
      ? (amenities as string[])
      : hasData(amenities)
      ? (amenities as string).split(",").map(a => a.trim())
      : null;
    newProp.hasBreakfastIncluded= cToBooleanSafe(hasBreakfastIncluded);

    // ─── Houseboat‐specific ───────────────────────────────────────────
    newProp.boatName            = hasData(boatName) ? (boatName as string).trim() : null;
    newProp.boatRegistrationNo  = hasData(boatRegistrationNo) ? (boatRegistrationNo as string).trim() : null;
    newProp.hasDiningFacility   = cToBooleanSafe(hasDiningFacility);

    // ─── Special Event‐specific ───────────────────────────────────────
    newProp.eventStartDate      = hasData(eventStartDate) ? new Date(eventStartDate as string) : null;
    newProp.eventEndDate        = hasData(eventEndDate)   ? new Date(eventEndDate as string)   : null;
    newProp.eventLocation       = hasData(eventLocation)  ? (eventLocation as string).trim() : null;

    // ─── Common Fields (all property‐types share) ─────────────────────────
    newProp.Included            = hasData(Included) ? (Included as string).trim() : null;
    newProp.distances           = hasData(distances) ? (distances as string).trim() : null;
    newProp.nearby_attractions  = hasData(nearby_attractions) ? (nearby_attractions as string).trim() : null;
    newProp.boat_type  = hasData(boat_type) ? (boat_type): BoatType.OTHER;
    newProp.termsAndConditions  = hasData(termsAndConditions) ? (termsAndConditions as string).trim() : null;

    // ─── Save to DB ──────────────────────────────────────────────────
    const inserted = await AppDataSource.getRepository(Property).save(newProp);
    return toJson(res, {
      data: inserted,
      message: "Property created successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

function safeNumber(val: any): number | null {
  if (val == null) return null;         // covers undefined / null
  const num = Number(val);
  return isNaN(num) ? null : num;
}


