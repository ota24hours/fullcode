import { Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Admin } from "../../../../src/entity/admin";
import { hashPassword } from "../../../../utils/utilities";
import { getPaginationValues } from "../../../../utils/pagination";
export const GetAdminList = async (
  req: Request,
  res: Response
) => {
  try {
    // 1) Ensure the caller is an authenticated admin
    if (!req?.admin) {
      throw new Error("invalid user entry");
    }

    // 2) Extract pagination (expects req.params.page = page number)
    const pagination = getPaginationValues(req.params.page);

    // 3) Extract query‐string filters: ?search=foo&status=1
    const { search, status } = req.query as { search?: string; status?: string };

    // 4) Build the QueryBuilder on Admin ("a")
    const repo = AppDataSource.getRepository(Admin);
    const qb = repo
      .createQueryBuilder("a")
      .select([
        "a.id",
        "a.user_name",
        "a.name",
        "a.phone_no",
        "a.apiKey",
        "a.status",
        "a.is_super_admin",
        "a.gender",
        "a.createdAt",
        "a.updatedAt",
      ]);

    // 5) Filter out super‐admins if you only want “non‐super” admins:
    qb.where("a.is_super_admin = :isSuper", { isSuper: false });

    // 6) Optional “search” filter on user_name OR name
    if (hasData(search)) {
      qb.andWhere(
        "(a.user_name LIKE :searchTerm OR a.name LIKE :searchTerm)",
        { searchTerm: `%${search}%` }
      );
    }

    // 7) Optional “status” filter
    if (hasData(status)) {
      qb.andWhere("a.status = :st", { st: cToBooleanSafe(status) });
    }

    // 8) Run count + paginated query in parallel
    const [total_count, admin_list] = await Promise.all([
      qb.getCount(),
      qb
        .offset(pagination.skip)
        .limit(pagination.limit)
        .getRawMany(),
    ]);

    // 9) Return JSON
    toJson(res, {
      data: {
        admin_list,
        total_count,
        limit: pagination.limit,
      },
    });
  } catch (error) {
    errorResponse(res, error);
  }
};