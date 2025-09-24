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
import { Review } from "../../../../src/entity/reviews";

export const createUserReview = async (req: Request, res: Response) => {
    try {
        const { propertyId, categoryId, rating, comment } = req.body;
        const propertyRepo = AppDataSource.getRepository(Property);
        const categoryRepo = AppDataSource.getRepository(Category);
        const property = await propertyRepo.findOne({ where: { id: propertyId } });
        if (!property) {
            return errorResponse(res, 'Invalid propertyId: property not found');
        }
        // Validate category exists
        const category = await categoryRepo.findOne({ where: { id: categoryId } });
        if (!category) {
            return errorResponse(res, 'Invalid categoryId: category not found');
        }

        const newSub = new Review();
        newSub.user = req.user; // Assuming req.user is set by authentication middleware
        newSub.property = property;
        newSub.category = category;
        newSub.rating = rating; // Assuming rating is a valid StarRating enum value
        newSub.comment = comment || null; // Optional comment
        const inserted = await AppDataSource.manager.save(Review, newSub);
        return toJson(res, {
            data: inserted,
            message: "Review created successfully",
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};