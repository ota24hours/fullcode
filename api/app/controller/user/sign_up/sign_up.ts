import { NextFunction, Request, Response } from "express";
import {
  cToBooleanSafe,
  errorResponse,
  hasData,
  isValidDate,
  toJson,
} from "node_custom_utils";

import { otpToken, otpValue } from "../../../../utils/jwt_utls";
import { validateEmail, validateMobile } from "../../../../utils/validators";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";
import { hashPassword } from "../../../../utils/utilities";
import { VENDOR_VERIFICATION_STATUS } from "../../../../src/entity/enum";
// import { validateEmail, validateMobile } from "../../../../utils/validators";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // if (!req?.admin) {
    //   throw new Error("invalid user Admin");
    // }
    // const id = req?.admin?.id;

    const {
      user_name,
      // password,
      user_type,
      email,
      phone
    } = req.body;

    if (!hasData(user_name)) {
      throw new Error("Both the 'user_name' required.");
    }

    // if (!hasData(email)) {
    //   throw new Error("Both the 'email' required.");
    // }
    if (!hasData(phone)) {
      throw new Error("Both the 'mobile' required.");
    }

    // if (!hasData(password)) {
    //   throw new Error("Both the 'password' required.");
    // }


    let user: User = new User();
    user.name = user_name;
    user.email = email;
    user.status = cToBooleanSafe(true);
    user.user_type = user_type;
    if (user_type === "vendor") {
      user.verified_status = VENDOR_VERIFICATION_STATUS.PENDING;
    } else {
      user.verified_status = VENDOR_VERIFICATION_STATUS.VERIFIED;
    }

    user.phone = phone;

    // user.password = await hashPassword(password); 
    const otp = otpValue();
    user.otp = otp;
    user.status= cToBooleanSafe(true);

    let userData = await AppDataSource.manager.save(User, user);

    const otpKey = otpToken(userData);


    toJson(res, {
      data: {
        id: user?.id,
        otpKey: otpKey,
        otp: otp,
      },
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
