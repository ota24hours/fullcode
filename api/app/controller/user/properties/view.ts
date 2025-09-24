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
import { USER_TYPE } from "../../../../src/entity/enum";

type ExtraItem = {
  key: string;
  value: any;
  icon_url?: string;
  mainOptions: string;
};
function groupByMainOptions(items: ExtraItem[] = []): Record<string, ExtraItem[]> {
  return items.reduce((acc, item) => {
    const groupKey = item.mainOptions || "default";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, ExtraItem[]>);
}


export const viewUserProperty = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const idQuery = req.query.id as string | undefined;
    const id = idParam || idQuery;
    if (!hasData(id)) {
      throw new Error("Property `id` parameter is required.");
    }

    const propRepo = AppDataSource.getRepository(Property);
    const prop = await propRepo.findOne({
      where: { id: String(id) },
      relations: [
        "cat_id",
        "sub_cat_id",
        "property_variants",
        "property_variants.propertyImgs",
        "property_variants.propertyPricing",
      ],
    });

    if (!prop) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    // Base URL for images
    const baseUrl = (process.env.IMAGE_BASE_URL || "").replace(/\/+$/, "");
    const now = new Date();

    // Prefix main property image
    if (hasData(prop.image)) {
      prop.image = `${baseUrl}${prop.image.startsWith("/") ? "" : "/"}${prop.image}`;
    }

    // Process each variant
    prop.property_variants?.forEach((variant) => {
      // Override rate based on active pricing
      const activePrice = variant.propertyPricing?.find((pr) =>
        pr.isActive &&
        new Date(pr.startDate) <= now &&
        now <= new Date(pr.endDate)
      );
      if (activePrice) {
        (variant as any).rate = Number(activePrice.rate);
      }

      // Prefix variant images
      variant.propertyImgs?.forEach((pi) => {
        if (hasData(pi.img_url)) {
          pi.img_url = `${baseUrl}${pi.img_url.startsWith("/") ? "" : "/"}${pi.img_url}`;
        }
      });

      // Group extraData/detailsData for end-users
      if (req?.user?.user_type === USER_TYPE.USER) {
        if (Array.isArray(variant.extraData)) {
          (variant as any).extraData = groupByMainOptions(
            variant.extraData as ExtraItem[]
          );
        }
        if (Array.isArray(variant.detailsData)) {
          (variant as any).detailsData = groupByMainOptions(
            variant.detailsData as ExtraItem[]
          );
        }
      }
    });

    // Return transformed property
    return toJson(res, { data: prop });
  } catch (error: any) {
    return errorResponse(res, error.message ?? error);
  }
};
