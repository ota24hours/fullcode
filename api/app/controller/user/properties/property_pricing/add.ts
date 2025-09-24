import { Request, Response } from "express";
import {
    cToBooleanSafe,
    DeleteLocalServerFile,
    errorResponse,
    hasData,
    toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../../src/data_source/data_source";
import { Property } from "../../../../../src/entity/properties";
import { PropertyVariants } from "../../../../../src/entity/property_veriants";
import { FileUploadToLocalServer } from "../../../../../utils/file_upload";
import { PropertyPricingVariants } from "../../../../../src/entity/pricing_variants";


const variantRepo = AppDataSource.getRepository(PropertyPricingVariants);
const parentVariantRepo = AppDataSource.getRepository(PropertyVariants);

export const createPricingVariant = async (req: Request, res: Response) => {
    try {
        const {
            variant_id,
            name,
            startDate,
            endDate,
            isActive,
            rate,
        } = req.body;

        // Optional: validate dates, name, rate, etc.
        const parent = variant_id
            ? await parentVariantRepo.findOne({ where: { id: variant_id } })
            : null;
        if (variant_id && !parent) {
            return errorResponse(res, { message: 'Variant Not Null pass a valid id' });
        }

        const newRecord = variantRepo.create({
            variant_id: parent,
            name,
            startDate,
            endDate,
            isActive: cToBooleanSafe(isActive),
            rate,
        });

        const saved = await variantRepo.save(newRecord);
        return toJson(res, { data: saved, message: 'Property price created successfully' });

    } catch (err) {
        console.error("createPricingVariant:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

