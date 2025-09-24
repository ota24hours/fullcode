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

export const updatePricingVariant = async (req: Request, res: Response) => {

    try {
        const {
            id,
            variant_id,
            name,
            startDate,
            endDate,
            isActive,
            rate,
        } = req.body;

        const record = await variantRepo.findOne({ where: { id } });
        if (!record) {
            return errorResponse(res, { message: 'id Passed Invalid' });

        }

        // If updating the relation
        if (variant_id !== undefined) {
            const parent = await parentVariantRepo.findOne({ where: { id: variant_id } });
            if (!parent) {
                // return res.status(404).json({ error: "Parent variant not found" });
                return errorResponse(res, { message: 'Parent variant not found' });
            }
            record.variant_id = parent;
        }

        if (name) record.name = name;
        if (startDate) record.startDate = startDate;
        if (endDate) record.endDate = endDate;
        if (isActive) record.isActive = isActive;
        if (rate) record.rate = rate;

        const updated = await variantRepo.save(record);
        return toJson(res, { data: updated, message: 'Property price updated successfully' });

    } catch (err) {
        console.error("updatePricingVariant:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};