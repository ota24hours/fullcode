import { Request, Response } from "express";
import {
  cToBooleanSafe,
  DeleteLocalServerFile,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { User } from "../../../../src/entity/user";
import { Category } from "../../../../src/entity/category";
import { FileUploadToLocalServer } from "../../../../utils/file_upload";

export const createCategory = async (req: Request, res: Response) => {
  let uploadedFileUrl: string = "";
  try {
    const { files } = req;

    const { name, status, propertyType } = req.body;

    if (hasData(files)) {
      if (files || Object.keys(files).length > 0) {
        try {
          uploadedFileUrl = await FileUploadToLocalServer({
            req,
            pathToUpload: "categories",
            fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
          });
          uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
        } catch (error: any) {
          DeleteLocalServerFile(uploadedFileUrl);
          return errorResponse(res, error.message);
        }
      }
    }

    // ─── Create & Save ───────────────────────────────────────────────────────
    const newCat = new Category();
    newCat.name = name.trim();
    newCat.propertyType = propertyType;
    newCat.img_url = uploadedFileUrl || ""; // Default to empty string if not provided  
    newCat.status = cToBooleanSafe(status); // Default to true if not provided

    const inserted = await AppDataSource.manager.save(Category, newCat);

    return toJson(res, {
      data: inserted,
      message: "Category created successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};