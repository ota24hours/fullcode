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
import { CustomizableItem } from "../../../../src/entity/customizable_items";
import { MainOptions } from "../../../../src/entity/enum";

export const createCustomizableItem = async (req: Request, res: Response) => {
  let uploadedFileUrl = "";

  try {
    const { name, status, mainOptions, customItem, propertyType } = req.body;

    // 1) Validate required fields
    if (!hasData(name) && !hasData(req.files)) {
      throw new Error('`name` is required, and either `icon_url` or file upload must be provided.');
    }

    // 2) Handle file upload (if any)
    const { files } = req;
    if (hasData(files) && Object.keys(files).length > 0) {
      try {
        uploadedFileUrl = await FileUploadToLocalServer({
          req,
          pathToUpload: "customizable-items",
          fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
        });
        uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
      } catch (err: any) {
        DeleteLocalServerFile(uploadedFileUrl);
        return errorResponse(res, err.message);
      }
    }

    const newCustomize = new CustomizableItem();
    newCustomize.name = name.trim();
    newCustomize.icon_url = uploadedFileUrl;
    if (hasData(mainOptions)) {
      newCustomize.mainOptions = mainOptions;
    } else {
      newCustomize.mainOptions = MainOptions.OTHER;
    }
    newCustomize.customItem = customItem;
    newCustomize.propertyType = propertyType;
    newCustomize.status = cToBooleanSafe(status); // Default to true if not provided

    const inserted = await AppDataSource.manager.save(CustomizableItem, newCustomize);


    return toJson(res, { data: inserted, message: 'CustomizableItem created successfully' });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};