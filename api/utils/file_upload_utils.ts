import { Request } from "express";
import { hasData } from "node_custom_utils";

export interface IFileUploadToLocalServer {
  req: Request;
  pathToUpload: string;
  imageKeyWord?: string;
  fileTypes?: string[];
}

export const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export const envValidator = () => {
  const {
    CDN_BASE_URL,
    CDN_ENDPOINT,
    CDN_ACCESS_KEY_ID,
    CDN_SECRET_ACCESS_KEY,
    CDN_BUCKET,
  } = process.env;

  if (!hasData(CDN_BASE_URL)) {
    throw new Error("The environment variable 'CDN_BASE_URL' is mandatory.");
  }

  if (!hasData(CDN_ENDPOINT)) {
    throw new Error("The 'CDN_ENDPOINT' environment variable is essential.");
  }

  if (!hasData(CDN_ACCESS_KEY_ID)) {
    throw new Error(
      "The environment variable 'CDN_ACCESS_KEY_ID' is obligatory."
    );
  }

  if (!hasData(CDN_SECRET_ACCESS_KEY)) {
    throw new Error(
      "The 'CDN_SECRET_ACCESS_KEY' environment variable is compulsory."
    );
  }

  if (!hasData(CDN_BUCKET)) {
    throw new Error("The environment variable 'CDN_BUCKET' is necessary.");
  }
};
