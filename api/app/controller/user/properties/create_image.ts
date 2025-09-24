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
export const createUserSubImages = async (req: Request, res: Response) => {
    let uploadedFileUrl: string = "";

    try {
        const { property_id } = req.body;

        const { files } = req;
        // ─── Validate Category (cat_id) if provided ───────────────────────────────
        let property: PropertyVariants | null = null;
        if (hasData(property_id)) {
            // parse as integer if cat_id was sent as string:
            property = await AppDataSource.getRepository(PropertyVariants).findOne({
                where: { id: property_id },
            });
            if (!property) {
                throw new Error(`Property with id=${property_id} not found.`);
            }
        }
        if (hasData(files)) {
            if (files || Object.keys(files).length > 0) {
                try {
                    uploadedFileUrl = await FileUploadToLocalServer({
                        req,
                        pathToUpload: "properties",
                        fileTypes: [".webp", ".png", ".jpg", ".jpeg"],
                    });
                    uploadedFileUrl = uploadedFileUrl.replace(/^(\.\/)?public/, "");
                } catch (error: any) {
                    DeleteLocalServerFile(uploadedFileUrl);
                    return errorResponse(res, error.message);
                }
            }
        }

        // ─── Determine status (defaults to true) ───────────────────────────────────

        // ─── Create & Save ────────────────────────────────────────────────────────
        const newSub = new PropertyImgs();
        newSub.variant_id = property;
        newSub.img_url = uploadedFileUrl;
        const inserted = await AppDataSource.manager.save(PropertyImgs, newSub);

        return toJson(res, {
            data: inserted,
            message: "Sub-category created successfully",
        });
    } catch (error) {
        return errorResponse(res, error);
    }
};