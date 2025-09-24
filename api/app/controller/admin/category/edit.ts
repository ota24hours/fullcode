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

export const updateCategory = async (req: Request, res: Response) => {
  let newUploadedFileUrl = "";
  try {
    const { id, name, status } = req.body;

    // ─── Validate ID and look up existing row ──────────────────────────────
    if (!hasData(id)) {
      throw new Error("Category `id` param is required.");
    }

    const repo = AppDataSource.getRepository(Category);
    const existing = await repo.findOne({ where: { id: id } });
    if (!existing) {
      throw new Error(`Category with id=${id} not found.`);
    }

    // ─── Validate & Apply Updates ───────────────────────────────────────────
    if (hasData(name)) {
      existing.name = name.trim();
    }

    if (hasData(status)) {

      existing.status = cToBooleanSafe(status);
    }
    const { files } = req;
    if (hasData(files)) {
      // Delete old file if present
      if (existing.img_url) {
        DeleteLocalServerFile(existing.img_url);
      }

      try {
        newUploadedFileUrl = await FileUploadToLocalServer({
          req,
          pathToUpload: "categories",
          fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
        });
        // Remove any leading "/public" if your URLs are served from there
        newUploadedFileUrl = newUploadedFileUrl.replace(/^(\.\/)?public/, "");
        existing.img_url = newUploadedFileUrl;
        const updated = await repo.save(existing);
        return toJson(res, {
          data: updated,
          message: "Category updated successfully",
        });
      } catch (uploadErr: any) {
        // Clean up partial upload
        DeleteLocalServerFile(newUploadedFileUrl);
        return errorResponse(res, uploadErr.message || uploadErr);
      }
    }

    const updated = await repo.save(existing);
    return toJson(res, {
      data: updated,
      message: "Category updated successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};
