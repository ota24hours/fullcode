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

export const updateUserProperty = async (req: Request, res: Response) => {
  let newUploadedFileUrl = "";
  try {
  

    // 2) Destructure possible fields (all optional)
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
       eventStartDate,
      eventEndDate,
      eventLocation,
      trade_name,
      id,

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


  if (!hasData(id)) {
      throw new Error("Property `id` parameter is required.");
    }

    const propRepo = AppDataSource.getRepository(Property);
    const existing = await propRepo.findOne({
      where: { id: String(id) },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // 1) Handle file upload (if a new image is provided)
    const { files } = req;
    if (hasData(files)) {
      // If there’s an existing image file, queue it for deletion
      if (existing.image) {
        DeleteLocalServerFile(existing.image);
      }

      try {
        // Upload new file to ./uploads/properties (or wherever FileUploadToLocalServer points)
        newUploadedFileUrl = await FileUploadToLocalServer({
          req,
          pathToUpload: "properties",
          fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
        });
         newUploadedFileUrl = newUploadedFileUrl.replace(/^(\.\/)?public/, "");
        existing.image = newUploadedFileUrl;
      } catch (uploadErr: any) {
        // Clean up if upload failed
        DeleteLocalServerFile(newUploadedFileUrl);
        return errorResponse(res, uploadErr.message || uploadErr);
      }
    }
    // ─── Update propertyType if provided ────────────────────────────────────
    if (hasData(propertyType)) {
      existing.propertyType = propertyType;
     
    }

    // ─── Update name ────────────────────────────────────────────────────────
    if (hasData(name)) {
      if (typeof name !== "string" || !name.trim()) {
        throw new Error("`name` must be a non-empty string if provided.");
      }
      existing.name = name.trim();
     
    }
      if (hasData(trade_name)) {
      existing.trade_name = (trade_name as string).trim();
     
    }

    // ─── Update description ─────────────────────────────────────────────────
    if (hasData(description)) {
      existing.description = (description as string).trim();
     
    }

    if (hasData(termsAndConditions)) {
      existing.termsAndConditions = (termsAndConditions as string).trim();    
    }

     // ─── Update description ─────────────────────────────────────────────────
    if (hasData(place)) {
      existing.place = (place as string).trim();
     
    }
     if (hasData(district)) {
      existing.district = (district as string).trim();
     
    }
      if (hasData(state)) {
      existing.state = (state as string).trim();
     
    }
     if (hasData(pincode)) {
      existing.pincode = (pincode as string).trim();
     
    }

    if(hasData(boat_type)) {
      existing.boat_type = boat_type;
    }

    // ─── Update rate ────────────────────────────────────────────────────────
    if (hasData(rate)) {
      if (isNaN(Number(rate))) {
        throw new Error("`rate` must be a valid number if provided.");
      }
      existing.rate = Number(rate);
      
    }

    // ─── Update isActive ────────────────────────────────────────────────────
    if (hasData(isActive)) {
      existing.isActive = cToBooleanSafe(isActive);
     
    }

    // ─── Update capacity ────────────────────────────────────────────────────
    if (hasData(capacity)) {
      existing.capacity = isNaN(Number(capacity)) ? null : Number(capacity);
      
    }

    // ─── Update Category if provided ────────────────────────────────────────
    if (hasData(cat_id)) {
      const category = await AppDataSource.getRepository(Category).findOne({
        where: { id: String(cat_id) },
      });
      if (!category) {
        throw new Error(`Category with id=${cat_id} not found.`);
      }
      existing.cat_id = category;
     
    }

    // ─── Update Subcategory if provided ─────────────────────────────────────
    if (hasData(sub_cat_id)) {
      const subCategory = await AppDataSource.getRepository(Sub_Category).findOne({
        where: { id: String(sub_cat_id) },
      });
      if (!subCategory) {
        throw new Error(`Sub_Category with id=${sub_cat_id} not found.`);
      }
      existing.sub_cat_id = subCategory;
     
    }

    // ─── Vehicle‐specific updates ───────────────────────────────────────────
    if (hasData(make)) {
      existing.make = (make as string).trim();
     
    }
    if (hasData(model)) {
      existing.model = (model as string).trim();
      
    }
    if (hasData(registrationNumber)) {
      existing.registrationNumber = (registrationNumber as string).trim();
    
    }
    if (hasData(transmission)) {
      existing.transmission = (transmission as string).trim();
    
    }

    // ─── Room‐specific updates ──────────────────────────────────────────────
    if (hasData(roomNumber)) {
      existing.roomNumber = (roomNumber as string).trim();
     
    }
    if (hasData(bedCount)) {
      existing.bedCount = isNaN(Number(bedCount)) ? null : Number(bedCount);
      
    }
    if (hasData(amenities)) {
      if (Array.isArray(amenities)) {
        existing.amenities = (amenities as string[]).map((a) => a.trim());
      } else {
        existing.amenities = (amenities as string)
          .split(",")
          .map((a) => a.trim());
      }
     
    }
    if (hasData(hasBreakfastIncluded)) {
      existing.hasBreakfastIncluded = cToBooleanSafe(hasBreakfastIncluded);
      
    }
    // ─── Trade name updates ────────────────────────────────────────────────
    if (hasData(Included)) {
      existing.Included = (Included as string).trim();
    }
    if (hasData(distances)) {
      existing.distances = (distances as string).trim();
    }
    if (hasData(nearby_attractions)) {
      existing.nearby_attractions = (nearby_attractions as string).trim();
    }
    

    // ─── Houseboat‐specific updates ────────────────────────────────────────
    if (hasData(boatName)) {
      existing.boatName = (boatName as string).trim();
     
    }
    if (hasData(boatRegistrationNo)) {
      existing.boatRegistrationNo = (boatRegistrationNo as string).trim();
    
    }
    if (hasData(hasDiningFacility)) {
      existing.hasDiningFacility = cToBooleanSafe(hasDiningFacility);
      
    }

    if (hasData(eventStartDate)) {
      const startDate = new Date(eventStartDate as string);
      if (isNaN(startDate.getTime())) {
        throw new Error("`eventStartDate` must be a valid date if provided.");
      }
      existing.eventStartDate = startDate;

    }
    if (hasData(eventEndDate)) {
      const endDate = new Date(eventEndDate as string);
      if (isNaN(endDate.getTime())) {
        throw new Error("`eventEndDate` must be a valid date if provided.");
      }
      existing.eventEndDate = endDate;
      
    }
    if (hasData(eventLocation)) {
      existing.eventLocation = (eventLocation as string).trim();
        }

  

    // ─── Save updates ────────────────────────────────────────────────────────
    const updated = await propRepo.save(existing);

    return toJson(res, {
      data: updated,
      message: "Property updated successfully",
    });
  } catch (error) {
    // If a new file was uploaded but something else failed, clean it up
    if (newUploadedFileUrl) {
      DeleteLocalServerFile(newUploadedFileUrl);
    }
    return errorResponse(res, error);
  }
};