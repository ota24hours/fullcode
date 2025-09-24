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

export const listMainOptions = (_req: Request, res: Response) => {
  const options = Object.values(MainOptions);
  return toJson(res, {
    data: options,
    message: 'Main options fetched successfully'
  });
};