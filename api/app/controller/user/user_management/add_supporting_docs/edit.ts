import { NextFunction, Request, Response } from "express";
import { DeleteLocalServerFile, errorResponse, hasData, toJson } from "node_custom_utils";
import { FileUploadToLocalServer } from "../../../../../utils/file_upload";
import { UserSupportingDocuments } from "../../../../../src/entity/user_supporting_docs";
import { AppDataSource } from "../../../../../src/data_source/data_source";

export const updateSupportingDocument = async (req: Request, res: Response) => {
  const { files, } = req;
  const { id, doc_type, expiry_date } = req.body;

  try {
    if (!req?.user?.id) {
      return errorResponse(res, 'Unauthorized: must be logged in');
    }

    const repo = AppDataSource.getRepository(UserSupportingDocuments);
    const docs = await repo.findOne({ where: { id: (id),} });
    if (!docs) {
      return errorResponse(res, 'Supporting document not found');
    }

    // Handle file update for doc_one
    if (hasData(files) && (files as any).docOne) {
      try {
        const newUrl = await FileUploadToLocalServer({
          req,
          imageKeyWord: 'docOne',
          pathToUpload: 'user_supporting',
          fileTypes: ['.webp', '.png', '.jpg', '.jpeg', '.pdf'],
        });
        // delete previous file
        if (docs.doc_one) {
          DeleteLocalServerFile(`./public${docs.doc_one}`);
        }
        docs.doc_one = newUrl.replace(/^\.?\/public/, '');
      } catch (err: any) {
        return errorResponse(res, err.message);
      }
    }

    // Update doc_type if provided
    if (doc_type !== undefined) {
      docs.doc_type = doc_type;
    }

    // Parse and update expiry_date if provided
    if (expiry_date) {
      let dt: Date;
      const m = expiry_date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (m) {
        const [, dd, mm, yyyy] = m;
        dt = new Date(`${yyyy}-${mm}-${dd}`);
      } else {
        dt = new Date(expiry_date);
      }
      if (isNaN(dt.getTime())) {
        return errorResponse(res, 'Invalid expiry_date format');
      }
      docs.expiry_date = dt;
    }

    const updated = await repo.save(docs);

    return toJson(res, {
      data: updated,
      message: 'Supporting document updated successfully',
    });
  } catch (error: any) {
    return errorResponse(res, error.message || error);
  }
};
