import { NextFunction, Request, Response } from "express";
import { DeleteLocalServerFile, errorResponse, hasData, toJson } from "node_custom_utils";
import { FileUploadToLocalServer } from "../../../../../utils/file_upload";
import { UserSupportingDocuments } from "../../../../../src/entity/user_supporting_docs";
import { AppDataSource } from "../../../../../src/data_source/data_source";

export const createOrUpdateSupportingDocuments = async (req: Request, res: Response) => {
    let uploadedFileUrl: string = "";


    try {
        // Ensure user is authenticated

        const { files } = req;
        const { doc_type, expiry_date } = req.body;
        if (hasData(files)) {
            try {
                uploadedFileUrl = await FileUploadToLocalServer({
                    req,
                    imageKeyWord: 'docOne',          // ← tell it which field to read
                    pathToUpload: 'user_supporting',
                    fileTypes: ['.webp', '.png', '.jpg', '.jpeg','.pdf'],
                });
                uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, '');
            } catch (err: any) {
                DeleteLocalServerFile(uploadedFileUrl);
                return errorResponse(res, err.message);
            }
        }
        const docs = new UserSupportingDocuments();
        docs.user_id = req?.user;
        // docs.expiry_date = expiry_date;
        if (hasData(expiry_date)) {
            let dt: Date;
            const ddmmyyyy = expiry_date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
            if (ddmmyyyy) {
                const [_, dd, mm, yyyy] = ddmmyyyy;
                dt = new Date(`${yyyy}-${mm}-${dd}`);
            } else {
                dt = new Date(expiry_date);
            }
            if (isNaN(dt.getTime())) {
                return errorResponse(res, 'Invalid expiry_date format');
            }
            docs.expiry_date = dt;
        }

        // Update fields
        docs.doc_type = doc_type;
        docs.doc_one = uploadedFileUrl;

        const inserted = await AppDataSource.manager.save(UserSupportingDocuments, docs);


        return toJson(res, {
            data: {
                inserted,

            },
            message: 'Supporting documents updated successfully',

        });
    } catch (error: any) {
        return errorResponse(res, error.message || error);
    }
};

