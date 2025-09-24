import * as bcrypt from "bcrypt";
const tokenKey = "EmSpNpS1D#LEe4x7*L0MBU4nkQFS@9MwGlwAZa6zQ*eujxbBMFpfiY";
import * as jwt from "jsonwebtoken";
import { MainOptions } from "../src/entity/enum";
// import { Socket } from "socket.io";
interface tokenResponse {
  error: boolean;
  value: any;
}
// export const extractDataFromSocketHeader = (
//   socket: Socket,
//   key: string,
// ): string => {
//   return (
//     socket.handshake.headers[key]?.toString() ||
//     socket.handshake.auth[key]?.toString() ||
//     ""
//   );
// };

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
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


export const parseDMY = (input: string): Date => {
  const [d, m, y] = input.split('/').map(Number);
  return new Date(y, m - 1, d);
};

export const isValidDateTimeFormat = (dateTime: string): boolean => {
  // Regex for YYYY-MM-DD HH:MM:SS format
  const dateTimeFormatRegex =
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return dateTimeFormatRegex.test(dateTime);
};

export const isValidDate = (date: string): boolean => {
  // Regex for YYYY-MM-DD format
  const dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return dateFormatRegex.test(date);
};


export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


export type ExtraItem = {
  key: string;
  value: any;
  icon_url?: string;
  mainOptions: string;  // incoming could be string
};

 export type GroupedExtra = {
  mainOptions: MainOptions;
  [dynamicKey: string]: any;
};

export  function groupExtraData(
  extraData: ExtraItem[]
): GroupedExtra[] {
  const map = new Map<MainOptions, GroupedExtra>();

  for (const item of extraData) {
    // skip anything not in the enum
    if (!Object.values(MainOptions).includes(item.mainOptions as MainOptions)) {
      continue;
    }
    const m = item.mainOptions as MainOptions;

    let group = map.get(m);
    if (!group) {
      group = { mainOptions: m };
      map.set(m, group);
    }

    group[item.key] = item.value;
  }

  return Array.from(map.values());
}