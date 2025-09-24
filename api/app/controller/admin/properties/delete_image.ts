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

export const deletePropertyImg = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("`id` parameter is required to delete a PropertyImgs record.");
    }

    const propImgRepo = AppDataSource.getRepository(PropertyImgs);
    const existing = await propImgRepo.findOne({ where: { id: id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "PropertyImgs not found." });
    }

    // 1) Delete the file from disk if present
    if (existing.img_url) {
      DeleteLocalServerFile(existing.img_url);
    }

    // 2) Delete the DB record
    await propImgRepo.remove(existing);

    return toJson(res, {
      data: null,
      message: "PropertyImgs deleted successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};