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

export const editPropertyVariant = async (req: Request, res: Response) => {
  let newUploadedFileUrl = "";

  try {
    const {
      id,
      name,
      rate,
      tax,
      max_person,
      person_allowed,
      extra_bed_available,
      rate_for_extra_bed,
      total_units_available,
       min_rate,
       extraData,
       child_count,
        waiting_rate,
      daily_rate,
      detailsData,
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

    // 1) Fetch existing variant
    if (!hasData(id)) {
      throw new Error("Variant `id` is required.");
    }
    const variantRepo = AppDataSource.getRepository(PropertyVariants);
    const existing = await variantRepo.findOne({ where: { id: String(id) } });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: `Variant id=${id} not found.` });
    }

    // 2) Handle new image upload (and delete old)
    if (hasData(files) && Object.keys(files).length > 0) {
      if (existing.img_url) {
        DeleteLocalServerFile(existing.img_url);
      }
      try {
        newUploadedFileUrl = await FileUploadToLocalServer({
          req,
          pathToUpload: "properties_variants",
          fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
        });
        newUploadedFileUrl = newUploadedFileUrl.replace(/^(\.\/)?public/, "");
        existing.img_url = newUploadedFileUrl;
      } catch (uploadErr: any) {
        // cleanup the newly uploaded before error
        DeleteLocalServerFile(newUploadedFileUrl);
        return errorResponse(res, uploadErr.message);
      }
    }

    // 3) Merge other fields (only if provided)
    if (hasData(name))               existing.name = (name as string).trim();
    if (hasData(rate))               existing.rate = Number(rate);
    if (hasData(tax))                existing.tax = Number(tax);
    if (hasData(max_person))         existing.max_person = Number(max_person);
    if (hasData(person_allowed))     existing.person_allowed = Number(person_allowed);
    if (hasData(extra_bed_available))
                                     existing.extra_bed_available = cToBooleanSafe(extra_bed_available);
    if (hasData(rate_for_extra_bed)) existing.rate_for_extra_bed = Number(rate_for_extra_bed);
    if (hasData(total_units_available)) existing.rate_for_extra_bed = Number(total_units_available);
    if (hasData(min_rate))           existing.min_rate = Number(min_rate);
    if (hasData(child_count))           existing.child_count = Number(child_count);
    if (hasData(extraData)) {
      try {
        existing.extraData = JSON.parse(extraData);
      } catch (jsonErr) {
        return errorResponse(res, "Invalid JSON format for `extraData`.");
      }
    }

      if (hasData(detailsData)) {
      try {
        existing.detailsData = JSON.parse(detailsData);
      } catch (jsonErr) {
        return errorResponse(res, "Invalid JSON format for `extraData`.");
      }
    }
     if(hasData(waiting_rate))existing.waiting_rate = Number(waiting_rate);
    if(hasData(daily_rate))existing.daily_rate = Number(daily_rate);

     ///New 
    if (hasData(capacity))existing.capacity = (capacity as string).trim();
    if (hasData(staff))existing.staff = (staff as string).trim();
    if (hasData(lifeBoys))existing.lifeBoys = (lifeBoys as string).trim();
    if (hasData(lifeJacket))existing.lifeJacket = (lifeJacket as string).trim();
    if (hasData(boat_material))existing.boat_material = (boat_material as string).trim();
    if (hasData(fire_safety))existing.fire_safety = (fire_safety as string).trim();

      ///NEw Vehicle Fields
    if (hasData(emergency_number))existing.emergency_number = (emergency_number as string).trim();
    if (hasData(capacity_transport))existing.capacity_transport = (capacity_transport as string).trim();
    if (hasData(vehicle_number))existing.vehicle_number = (vehicle_number as string).trim();
    if (hasData(permit_expiry))existing.permit_expiry = (permit_expiry as string).trim();
    if (hasData(fitness_expiry))existing.fitness_expiry = (fitness_expiry as string).trim();
    if (hasData(rc_expiry))existing.rc_expiry = (rc_expiry as string).trim();
    if (hasData(puc_number))existing.puc_number = (puc_number as string).trim();
    if (hasData(puc_expiry))existing.puc_expiry = (puc_expiry as string).trim();
    if (hasData(insurance_number))existing.insurance_number = (insurance_number as string).trim();
    if (hasData(insurance_expiry))existing.insurance_expiry = (insurance_expiry as string).trim();
    if (hasData(details))existing.details = (details as string).trim();
    if (hasData(rc_number))existing.rc_number = (rc_number as string).trim();

        if (hasData(fitness_number)) existing.fitness_number = (fitness_number as string).trim();
    if (hasData(permit_number)) existing.permit_number = (permit_number as string).trim();

     /// New Fields
    if (hasData(one_day_min_rate)) existing.one_day_min_rate = (one_day_min_rate);
    if (hasData(one_day_included_km)) existing.one_day_included_km = (one_day_included_km);
    if (hasData(one_day_included_hours)) existing.one_day_included_hours = (one_day_included_hours);
    if (hasData(one_day_add_km)) existing.one_day_add_km = (one_day_add_km);
    if (hasData(one_day_add_hr)) existing.one_day_add_hr = (one_day_add_hr);
    if (hasData(one_day_bata)) existing.one_day_bata = (one_day_bata);
    if (hasData(two_day_min_rate)) existing.two_day_min_rate = (two_day_min_rate);
    if (hasData(two_day_included_km)) existing.two_day_included_km = (two_day_included_km);
    if (hasData(two_day_included_hours)) existing.two_day_included_hours = (two_day_included_hours);
    if (hasData(two_day_add_km)) existing.two_day_add_km = (two_day_add_km);
    if (hasData(two_day_add_hr)) existing.two_day_add_hr = (two_day_add_hr);
    if (hasData(two_day_bata)) existing.two_day_bata = (two_day_bata);
    if (hasData(three_day_min_rate)) existing.three_day_min_rate = (three_day_min_rate);
    if (hasData(three_day_included_km)) existing.three_day_included_km = (three_day_included_km);
    if (hasData(three_day_included_hours)) existing.three_day_included_hours = (three_day_included_hours);
    if (hasData(three_day_add_km)) existing.three_day_add_km = (three_day_add_km);
    if (hasData(three_day_add_hr)) existing.three_day_add_hr = (three_day_add_hr);
    if (hasData(three_day_bata)) existing.three_day_bata = (three_day_bata);
    if (hasData(event_time)) existing.event_time = (event_time as string).trim();
    if (hasData(event_date)) existing.event_date = (event_date as string).trim();

    if (hasData(breakfast_rate)) existing.breakfast_rate = (breakfast_rate);
        if (hasData(lunch_rate)) existing.lunch_rate = (lunch_rate);
        if (hasData(dinner_rate)) existing.dinner_rate = (dinner_rate);
        if (hasData(extra_hour_rate)) existing.extra_hour_rate = (extra_hour_rate);
        if (hasData(extra_person_rate)) existing.extra_person_rate = (extra_person_rate);

        if (hasData(additional_rate_km)) existing.additional_rate_km = (additional_rate_km);
        if (hasData(km_min_rate)) existing.km_min_rate = (km_min_rate);
        if(hasData(boat_type)) existing.boat_type = boat_type;
        if(hasData(percentage)) existing.percentage = percentage;
    
    // 4) Save & respond
    const updated = await variantRepo.save(existing);
    return toJson(res, {
      data: updated,
      message: "Property variant updated successfully",
    });
  } catch (err) {
    // Roll back uploaded file if anything failed
    if (newUploadedFileUrl) DeleteLocalServerFile(newUploadedFileUrl);
    return errorResponse(res, err);
  }
};