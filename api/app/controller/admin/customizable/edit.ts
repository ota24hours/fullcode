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

export const editCustomizableItem = async (req: Request, res: Response) => {
  let uploadedFileUrl = "";

  try {
    const { id, name, status,mainOptions,customItem,propertyType } = req.body;
    if (!hasData(id)) {
      throw new Error('`id` is required to update an item.');
    }

    // 1) Fetch existing item
    const repo = AppDataSource.getRepository(CustomizableItem);
    const item = await repo.findOneOrFail({ where: { id } });

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
        // delete old icon if present
        if (hasData(item.icon_url)) {
          DeleteLocalServerFile(item.icon_url);
        }
        item.icon_url = uploadedFileUrl;
      } catch (err: any) {
        DeleteLocalServerFile(uploadedFileUrl);
        return errorResponse(res, err.message);
      }
    }

    // 3) Apply other updates
    if (hasData(name))   item.name   = name.trim();
    if (hasData(mainOptions))   item.mainOptions   = mainOptions;
    if (hasData(customItem))   item.customItem   = customItem;
    if (hasData(propertyType))   item.propertyType   = propertyType;
    if (hasData(status)) item.status = cToBooleanSafe(status);

    // 4) Save changes
    const updated = await AppDataSource.manager.save(CustomizableItem, item);

    return toJson(res, { data: updated, message: 'CustomizableItem updated successfully' });
  } catch (error: any) {
    return errorResponse(res, error);
  }
};