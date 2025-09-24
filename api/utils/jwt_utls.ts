import * as jwt from "jsonwebtoken";

const tokenKey = process.env.JWT_SECRET || "EmSpNpS1D#LEe4x7*L0MBU4nkQFS@9MwGlwAZa6zQ*eujxbBMFpfiY";



interface tokenResponse {
    error: boolean;
    value: any;
  }

export const otpValue: () => number = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  
  export const otpToken = (params: any): string => {
    let key = jwt.sign(
      {
        data: params,
      },
      tokenKey,
      { expiresIn: 60 * 5 },
    );
    return key;
  };

  export const tokenDecode = (token: string): tokenResponse => {
    try {
      let decoded = jwt.verify(token, tokenKey);
      return { error: false, value: decoded };
    } catch (err) {
      return { error: true, value: err };
    }
  };


export const tokenEncode = (params: any): string => {
    let key = jwt.sign(
      {
        data: params,
      },
      tokenKey,
    );
    return key;
  };
  
  export const tokenAuthDecode = (token: string): tokenResponse => {
    try {
      let decoded = jwt.verify(token, tokenKey);
      return { error: false, value: decoded };
    } catch (err) {
      return { error: true, value: err };
    }
  };