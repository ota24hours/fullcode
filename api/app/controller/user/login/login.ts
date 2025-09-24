import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";
import { otpToken, otpValue, tokenEncode } from "../../../../utils/jwt_utls";
import { comparePassword } from "../../../../utils/utilities";


export const UserLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!(hasData(phone))) {
      throw new Error(`The 'phone' : ${phone} are required.`);
    }

    const user = await AppDataSource.manager.findOne(User, {
      where: {
        phone,
        status: cToBooleanSafe(true), // Only fetch if active_status is true
      },
    });

    if (!user) {
      throw new Error(
        "Login failed: The user may not be registered or their account is currently inactive.",
      );
    }

    const otp = otpValue();
    user.otp = otp;
    var userSaved = await AppDataSource.manager.save(User, user);

    const otpKey = otpToken(user);

    toJson(res, {
      data: {
        user_typr: user?.user_type ?? 'user',
        id: user?.id ?? '',
        otp: otp,
        otpKey: otpKey,
      },
    });
  } catch (error) {
    errorResponse(res, error);
  }
};