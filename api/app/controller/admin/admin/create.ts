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

export const createAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req?.admin) {
      throw new Error("invalid user Admin");
    }
    const id = req?.admin?.id;

    const {
      user_name,
      name,
      status,
      is_super_admin,
      password,
      user_type
    } = req.body;

    if (!hasData(user_name)) {
      throw new Error("Both the 'user_name' required.");
    }
  
    if (!hasData(status)) {
      throw new Error("Both the 'status' required.");
    }
    if (!hasData(is_super_admin)) {
      throw new Error("Both the 'is_super_admin' required.");
    }
  
    if (!hasData(password)) {
      throw new Error("Both the 'password' required.");
    }

    let user: Admin = new Admin();
    user.user_name = user_name;
    user.name = name;
    user.status = cToBooleanSafe(status);

    if (hasData(is_super_admin)) {
      user.is_super_admin = cToBooleanSafe(is_super_admin);
    }
    user.password = await hashPassword(password);

    await AppDataSource.manager.save(Admin, user);

    toJson(res, {
      data: {
        super_admin: user.is_super_admin,
        id: user?.id,
      },
    });
  } catch (error) {
    errorResponse(res, error);
  }
};