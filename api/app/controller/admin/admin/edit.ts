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

export const editAdmin = async (req: Request, res: Response) => {
  try {
    if (!req?.admin) {
      throw new Error("invalid user Admin");
    }

    // The ID of the admin to edit is typically passed as a URL param:
    // e.g. PUT /api/admins/:id
   
    

    // Extract fields to update
    const {
      targetAdminId,
      user_name,
      name,
      status,
      is_super_admin,
      password,
      user_type,
    } = req.body;
if (!hasData(targetAdminId)) {
      throw new Error("Missing 'id' parameter");
    }

    // Find existing admin
    const existing = await AppDataSource.manager.findOne(Admin, {
      where: { id: targetAdminId},
    });
    if (!existing) {
      throw new Error("Admin not found");
    }
    // If you want to restrict who can edit which fields, you can check req.admin here.
    if (hasData(user_name)) {
      existing.user_name = user_name;
    }
    if (hasData(name)) {
      existing.name = name;
    }
    if (hasData(status)) {
      existing.status = cToBooleanSafe(status);
    }
    if (hasData(is_super_admin)) {
      existing.is_super_admin = cToBooleanSafe(is_super_admin);
    }
    if (hasData(password)) {
      existing.password = await hashPassword(password);
    }


    // Save changes
    await AppDataSource.manager.save(Admin, existing);

    toJson(res, {
      data: {
        message: "Admin updated successfully",
        admin: {
          id: existing.id,
          user_name: existing.user_name,
          name: existing.name,
          status: existing.status,
          is_super_admin: existing.is_super_admin,
        },
      },
    });
  } catch (error) {
    errorResponse(res, error);
  }
};