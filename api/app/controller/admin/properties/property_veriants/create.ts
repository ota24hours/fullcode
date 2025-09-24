import { Request, Response } from "express";
import {
  cToBooleanSafe,
  DeleteLocalServerFile,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../../src/data_source/data_source";
import { Property } from "../../../../../src/entity/properties";
import { PropertyVariants } from "../../../../../src/entity/property_veriants";
import { FileUploadToLocalServer } from "../../../../../utils/file_upload";

export const createPropertyVariant = async (req: Request, res: Response) => {
  let uploadedFileUrl: string = "";

  try {
    const { propertyId, name, rate, tax, max_person, person_allowed, extra_bed_available, rate_for_extra_bed, total_units_available, min_rate, child_count,
      extraData, waiting_rate, daily_rate, detailsData,
      ////This Is the New Fields
      capacity,
      staff,
      lifeBoys,
      lifeJacket,
      boat_material,
      fire_safety,

       ///new Fields
      emergency_number,
      capacity_transport,
      vehicle_number,
      permit_expiry,
      fitness_expiry,
      rc_number,
      rc_expiry,
      puc_number,
      puc_expiry,
      insurance_number,
      insurance_expiry,
      details,
      
      // fitness_number,
      fitness_number,
      permit_number,

            /// New Fields

      one_day_min_rate,
      one_day_included_km,
      one_day_included_hours,
      one_day_add_km,
      one_day_add_hr,
      one_day_bata,
      two_day_min_rate,
      two_day_included_km,
      two_day_included_hours,
      two_day_add_km,
      two_day_add_hr,
      two_day_bata,
      three_day_min_rate,
      three_day_included_km,
      three_day_included_hours,
      three_day_add_km,
      three_day_add_hr,
      three_day_bata,
      event_time,
      event_date,

      
      //New Fields
      breakfast_rate,
      lunch_rate,
      dinner_rate,
      extra_hour_rate,
      extra_person_rate,

      additional_rate_km,
      km_min_rate,

      boat_type,
      percentage,
    } = req.body;
    const { files } = req;

    if (!hasData(propertyId)) {
      return errorResponse(res, '`propertyId` is required.');
    }

    // Validate parent property
    const property = await AppDataSource.getRepository(Property).findOne({ where: { id: propertyId } });
    if (!property) {
      return errorResponse(res, `Property with id=${propertyId} not found.`);
    }

    if (hasData(files)) {
      if (files || Object.keys(files).length > 0) {
        try {
          uploadedFileUrl = await FileUploadToLocalServer({
            req,
            pathToUpload: "properties_variants",
            fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
          });
          uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
        } catch (error: any) {
          DeleteLocalServerFile(uploadedFileUrl);
          return errorResponse(res, error.message);
        }
      }
    }
    // Build and save variant
    const variantRepo = AppDataSource.getRepository(PropertyVariants);
    const variant = variantRepo.create({
      property_id: property,
      name,
      rate,
      tax,
      max_person,
      person_allowed,
      extra_bed_available: cToBooleanSafe(extra_bed_available),
      rate_for_extra_bed,
      img_url: uploadedFileUrl,
      total_units_available: total_units_available,
      min_rate: min_rate,
       extraData: hasData(extraData) ? JSON.parse(extraData) : [],
      detailsData: hasData(detailsData) ? JSON.parse(detailsData) : [],
      child_count: child_count,
      waiting_rate: waiting_rate,
      daily_rate: daily_rate,
      capacity: capacity,
      staff: staff,
      lifeBoys: lifeBoys,
      lifeJacket: lifeJacket,
      boat_material: boat_material,
      fire_safety: fire_safety,
       emergency_number:emergency_number,
      capacity_transport:capacity_transport,
      vehicle_number:vehicle_number,
      permit_expiry:permit_expiry,
      fitness_expiry:fitness_expiry,
      rc_number:rc_number,
      rc_expiry:rc_expiry,
      puc_number:puc_number,
      puc_expiry:puc_expiry,
      insurance_number:insurance_number,
      insurance_expiry:insurance_expiry,
      details:details,
        fitness_number:fitness_number,
      permit_number:permit_number,
      one_day_min_rate:one_day_min_rate,
      one_day_included_km:one_day_included_km,
      one_day_included_hours:one_day_included_hours,
      one_day_add_km:one_day_add_km,
      one_day_add_hr:one_day_add_hr,
      one_day_bata:one_day_bata,
      two_day_min_rate:two_day_min_rate,
      two_day_included_km:two_day_included_km,
      two_day_included_hours:two_day_included_hours,
      two_day_add_km:two_day_add_km,
      two_day_add_hr:two_day_add_hr,
      two_day_bata:two_day_bata,
      three_day_min_rate:three_day_min_rate,
      three_day_included_km:three_day_included_km,
      three_day_included_hours:three_day_included_hours,
      three_day_add_km:three_day_add_km,
      three_day_add_hr:three_day_add_hr,
      three_day_bata:three_day_bata,
      event_time:event_time,
      event_date:event_date,
        extra_person_rate:extra_person_rate,
      dinner_rate:dinner_rate,
      lunch_rate:lunch_rate,
      breakfast_rate:breakfast_rate,
      extra_hour_rate:extra_hour_rate,
      additional_rate_km:additional_rate_km,
      km_min_rate:km_min_rate,
      boat_type: boat_type, // Use property type if not provided
      percentage: percentage,
    });

    const saved = await variantRepo.save(variant);
    return toJson(res, { data: saved, message: 'Property variant created successfully' });
  } catch (err) {
    return errorResponse(res, err);
  }
}