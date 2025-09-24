// utils/file-upload.ts
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { mkdir, writeFile, copyFile } from "fs/promises";

interface ImageUploadOptions {
  req: Request;
  pathToUpload: string;         // e.g. "products", "avatars", etc.
  imageKeyWord: string;         // the field name in your form/data, e.g. "product_img"
  baseUrl?: string;             // optional prefix URL, e.g. `${process.env.APP_URL}/uploads`
}

/**
 * Uploads exactly one image from `req` to the local server,
 * giving it a UUID-based filename so you never collide.
 */
export async function uploadImageToLocalServer(options: ImageUploadOptions): Promise<string> {
  const { req, pathToUpload, imageKeyWord, baseUrl = "" } = options;
  console.log("[uploadImage] Starting upload for field:", imageKeyWord);

  const file = (req.files as any)?.[imageKeyWord] || req.files;
  console.log("[uploadImage] Raw file object:", file);

  if (!file) {
    console.error("[uploadImage] No file found under field:", imageKeyWord);
    throw new Error(`No file found under field "${imageKeyWord}"`);
  }

  // Multer compatibility: file might be an array
  const img = Array.isArray(file) ? file[0] : file;
  console.log("[uploadImage] Using file:", {
    originalname: img.originalname,
    mimetype: img.mimetype,
    size: img.size,
    path: img.path,
  });

  // Validate extension
  const allowed = [".webp", ".png", ".jpg", ".jpeg"];
  const ext = path.extname(img.originalname).toLowerCase();
  console.log("[uploadImage] File extension:", ext);

  if (!allowed.includes(ext)) {
    console.error("[uploadImage] Invalid file type:", ext);
    throw new Error(`Invalid file type "${ext}". Only images are allowed.`);
  }

  // Build a unique filename
  const filename = `${uuidv4()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", pathToUpload);
  console.log("[uploadImage] Upload directory:", uploadDir);
  console.log("[uploadImage] Final filename:", filename);

  // Ensure directory exists
  console.log("[uploadImage] Ensuring directory exists...");
  await mkdir(uploadDir, { recursive: true });
  console.log("[uploadImage] Directory ready.");

  if (img.buffer) {
    console.log("[uploadImage] Writing file from memory buffer...");
    await writeFile(path.join(uploadDir, filename), img.buffer);
    console.log("[uploadImage] Write complete.");
  } else if (img.path) {
    console.log("[uploadImage] Copying file from temp path:", img.path);
    await copyFile(img.path, path.join(uploadDir, filename));
    console.log("[uploadImage] Copy complete.");
  } else {
    console.error("[uploadImage] Unable to read file data for upload");
    throw new Error("Unable to read file data for upload");
  }

  const fileUrl = baseUrl
    ? `${baseUrl}/${pathToUpload}/${filename}`
    : `/uploads/${pathToUpload}/${filename}`;

  console.log("[uploadImage] Upload successful. URL:", fileUrl);
  return fileUrl;
}
