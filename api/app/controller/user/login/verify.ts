import { NextFunction, Request, Response } from "express";
import { errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { User } from "../../../../src/entity/user";
import { otpToken, otpValue, tokenEncode } from "../../../../utils/jwt_utls";
import { comparePassword, tokenDecode } from "../../../../utils/utilities";


export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { otpKey, otp } = req.body;
  
        if (!hasData(otpKey)) {
          throw new Error("If you could, kindly provide the OTP key.");
        }
    
        if (!hasData(otp)) {
          throw new Error("If you could, please provide the OTP.");
        }
    
        let decoded_data = tokenDecode(otpKey);
    
        if (decoded_data.error) {
          throw "OTP expired";
        }
    
        if (!(decoded_data.value.data.otp.toString() === otp)) {
          throw "Verification failed";
        }
        console.log('The Decoded Id => '+decoded_data.value.data.id);
        let key = tokenEncode(decoded_data.value.data.id);
    
     
        const verifiedAccount = await AppDataSource.manager.findOne(User, {
          where: {
              id: decoded_data.value.data.id,
          
          },
      });
  
    
        if (verifiedAccount == null) {
          throw "Your account has been suspended.";
        }
    
        verifiedAccount.api_key = key;
      await AppDataSource.manager.save(User, verifiedAccount);
  
         toJson(res, {
          data: {
            user_id: verifiedAccount?.id,
            key,
            message: "Verified",
          },
        });
  
    } catch (error) {
           // Handle errors
           errorResponse(res, error);

           // Optional: Forward the error to a centralized error handler
           next(error);
    }
  };