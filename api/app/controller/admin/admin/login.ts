import { Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  toJson,
} from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { Admin } from "../../../../src/entity/admin";
import { comparePassword, hashPassword, tokenEncode } from "../../../../utils/utilities";

export const login = async (req: Request, res: Response) : Promise<void> => {
    try {
      const { username, password } = req.body;
  
      if (!(hasData(username) && hasData(password))) {
        throw new Error("Both the 'User Name' and 'password' are required fields.");
      }
  
      const user = await AppDataSource.manager.findOne(Admin, {
        where: {
            user_name: username,
        },
      });
  
      if (!user) {
        throw new Error(
          "It appears that the admin credentials provided are invalid.",
        );
      }
  
      const passwordValidate = await comparePassword(
        password,
        user?.password ?? "",
      );
  
      if (!passwordValidate) {
        throw new Error("Invalid password.");
      }
  
      const api_key = tokenEncode(user?.id);
      user.apiKey = api_key;
  
      await AppDataSource.manager.save(Admin, user);
  
       toJson(res, {
        data: {
          super_admin: user.is_super_admin,
          id: user?.id,
          api_key,
        },
      });
    } catch (error) {
       errorResponse(res, error);
    }
  };