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
export const MultipleFileUpload = async ({
  req,
  pathToUpload,
  imageKeyWord,
  fileTypes = ALLOWED_EXTENSIONS,
  fileObjects, // NEW: Optional direct input for multiple files
}: IFileUploadToLocalServer & { fileObjects?: UploadedFile[] }) => {
  const filesToProcess: UploadedFile[] = [];

  if (fileObjects && fileObjects.length > 0) {
    filesToProcess.push(...fileObjects);
  } else {
    const { files } = req;

    if (!files || Object.keys(files).length === 0) {
      throw new Error(
        "It appears that no file has been uploaded on your part. Kindly proceed to upload the necessary document."
      );
    }

    const uploadedFile = files[imageKeyWord ?? "img"] as UploadedFile | UploadedFile[];

    if (Array.isArray(uploadedFile)) {
      filesToProcess.push(...uploadedFile);
    } else {
      filesToProcess.push(uploadedFile);
    }
  }

  const uploadedUrls: string[] = [];

  const upDir = `./public${
    process.env.DEBUG === "false" ? "/live/" : "/test/"
  }${pathToUpload}`;

  // Ensure directory exists
  await fsx.ensureDir(upDir);

  for (const file of filesToProcess) {
    if (!file?.name) {
      throw new Error("One of the uploaded files does not have a valid name.");
    }

    const ext = path.extname(file.name).toLowerCase();

    if (!fileTypes.includes(ext)) {
      throw new Error(`File format '${ext}' is not supported.`);
    }

    const uniqueFileName = `${uuidv4()}${ext}`;
    const up = path.join(upDir, uniqueFileName);

    await file.mv(up);

    uploadedUrls.push(up.replace("./public", ""));
  }

  return uploadedUrls;
};
