import { UploadedFile } from "express-fileupload";

import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import * as fsx from "fs-extra";
import { ALLOWED_EXTENSIONS, IFileUploadToLocalServer } from "node_custom_utils";




/**
 * ## Uploads a file to the local server.
 * @param {Object} options - The options for file upload.
 * @param {Object} options.req - The request object containing the uploaded files.
 * @param {string} options.pathToUpload - The path on the server where the file will be uploaded.
 * @param {string} options.imageKeyWord - The key in the request object containing the uploaded file.
 * @param {Array} options.fileTypes - An array of allowed file extensions.
 * @throws Will throw an error if files are not provided, file format is not supported,
 *         uploaded file already exists, or if there are any file operation errors.
 * @returns {string} - The URL of the uploaded file on the server.
 *
 *```typescript
 * // Call the FileUploadToLocalServer function
 * const uploadedFileUrl = await FileUploadToLocalServer({
 *   req,
 *   pathToUpload,
 *   imageKeyWord,
 * });
 *```
 **/
export const FileUploadToLocalServer = async ({
  req,
  pathToUpload,
  imageKeyWord,
  fileTypes = ALLOWED_EXTENSIONS,
}: IFileUploadToLocalServer) => {
  const { files } = req;

  if (!files || Object.keys(files).length === 0) {
    throw new Error(
      "It appears that no file has been uploaded on your part. Kindly proceed to upload the necessary document."
    );
  }

  const uploadedFile = files[imageKeyWord ?? "img"] as UploadedFile;

  if (!uploadedFile?.name) {
    throw new Error(
      `No file specified for ${imageKeyWord ?? "img"} has been provided.`
    );
  }

  const ext = path.extname(uploadedFile.name).toLowerCase();

  if (!fileTypes.includes(ext)) {
    throw new Error("The file format you have submitted is not compatible.");
  }

  // Generate a new unique filename using UUID and original extension
  const uniqueFileName = `${uuidv4()}${ext}`;

  // Upload directory path
  const upDir = `./public${
    process.env.DEBUG === "false" ? "/live/" : "/test/"
  }${pathToUpload}`;

  // Full path to save file
  const up = path.join(upDir, uniqueFileName);

  // Ensure directory exists
  await fsx.ensureDir(upDir);

  // Move/upload file
  await uploadedFile.mv(up);

  // Return URL path for accessing the file (relative to public folder)
  return up.replace("./public", "");
};
