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
import { PropertyImgs } from "../../../../src/entity/properties_imgs";
import { PropertyVariants } from "../../../../src/entity/property_veriants";

export const updateUserPropertyImg = async (req: Request, res: Response) => {
  let newUploadedFileUrl = "";
  try {
     const { property_id,id } = req.body;
    if (!hasData(id)) {
      throw new Error("`id` parameter is required to update a PropertyImgs record.");
    }

    const propImgRepo = AppDataSource.getRepository(PropertyVariants);
    const existing = await propImgRepo.findOne({
      where: { id: id },
      relations: ["property_id"],
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "PropertyImgs not found." });
    }

    // 1) Optionally update the linked property
   
    if (hasData(property_id)) {
      const prop = await AppDataSource.getRepository(Property).findOne({
        where: { id: String(property_id) },
      });
      if (!prop) {
        throw new Error(`Property with id=${property_id} not found.`);
      }
      existing.property_id = prop;
    }

    // 2) If a new file is uploaded, replace the old image
    const { files } = req;
    if (hasData(files)) {
      // Delete old file if present
      if (existing.img_url) {
        DeleteLocalServerFile(existing.img_url);
      }

      try {
        newUploadedFileUrl = await FileUploadToLocalServer({
          req,
          pathToUpload: "properties",
          fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
        });
        // Remove any leading "/public" if your URLs are served from there
        newUploadedFileUrl = newUploadedFileUrl.replace(/^(\.\/)?public/, "");
        existing.img_url = newUploadedFileUrl;
      } catch (uploadErr: any) {
        // Clean up partial upload
        DeleteLocalServerFile(newUploadedFileUrl);
        return errorResponse(res, uploadErr.message || uploadErr);
      }
    }

    // 3) Save changes
    const updated = await propImgRepo.save(existing);
    return toJson(res, {
      data: updated,
      message: "PropertyImgs updated successfully",
    });
  } catch (error) {
    // If a new file was uploaded but something else failed, delete it
    if (newUploadedFileUrl) {
      DeleteLocalServerFile(newUploadedFileUrl);
    }
    return errorResponse(res, error);
  }
};