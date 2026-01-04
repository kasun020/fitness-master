import { v2 as cloudinary } from "cloudinary";

let hasLoggedConfigured = false;
let hasAppliedConfig = false;

function stripOuterQuotes(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizeCloudinaryUrlEnv() {
  // dotenv may parse lines like: CLOUDINARY_URL = CLOUDINARY_URL=cloudinary://...
  // Normalize to just: cloudinary://api_key:api_secret@cloud_name
  const raw = stripOuterQuotes(process.env.CLOUDINARY_URL);
  if (typeof raw !== "string") return;

  const prefix = "CLOUDINARY_URL=";
  const trimmed = raw.trim();
  process.env.CLOUDINARY_URL = trimmed.startsWith(prefix)
    ? trimmed.slice(prefix.length)
    : trimmed;
}

function parseCloudinaryUrl(cloudinaryUrl) {
  const parsed = new URL(cloudinaryUrl);
  const cloudName = parsed.hostname;
  const apiKey = parsed.username;
  const apiSecret = parsed.password;
  return {
    cloudName: cloudName || null,
    apiKey: apiKey || null,
    apiSecret: apiSecret || null,
  };
}

function getCloudNameFromUrl(cloudinaryUrl) {
  try {
    const parsed = new URL(cloudinaryUrl);
    return parsed.hostname || null;
  } catch {
    return null;
  }
}

export function assertCloudinaryConfigured() {
  // IMPORTANT: in Node ESM, modules are evaluated before api/index.js runs
  // `dotenv.config()`. So Cloudinary must be configured lazily here.
  normalizeCloudinaryUrlEnv();

  const cloudinaryUrl = stripOuterQuotes(process.env.CLOUDINARY_URL);
  const cloudNameEnv = stripOuterQuotes(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKeyEnv = stripOuterQuotes(process.env.CLOUDINARY_API_KEY);
  const apiSecretEnv = stripOuterQuotes(process.env.CLOUDINARY_API_SECRET);

  const hasUrl = typeof cloudinaryUrl === "string" && cloudinaryUrl.length > 0;
  const hasExplicit = Boolean(cloudNameEnv && apiKeyEnv && apiSecretEnv);

  if (!hasUrl && !hasExplicit) {
    throw new Error(
      "Cloudinary is not configured. Set either CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in your environment."
    );
  }

  if (!hasAppliedConfig) {
    let cloudName = cloudNameEnv;
    let apiKey = apiKeyEnv;
    let apiSecret = apiSecretEnv;

    if (hasUrl) {
      const parsed = parseCloudinaryUrl(cloudinaryUrl);
      cloudName = parsed.cloudName;
      apiKey = parsed.apiKey;
      apiSecret = parsed.apiSecret;
    }

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "Cloudinary credentials are incomplete. Check your CLOUDINARY_URL format or set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    hasAppliedConfig = true;
  }

  const cloudName = hasUrl ? getCloudNameFromUrl(cloudinaryUrl) : cloudNameEnv;
  if (!hasLoggedConfigured) {
    console.log(
      `[cloudinary] configured${cloudName ? ` (cloud: ${cloudName})` : ""}`
    );
    hasLoggedConfigured = true;
  }
}

function bufferToDataUri(file) {
  const mime = file?.mimetype || "application/octet-stream";
  const base64 = file?.buffer?.toString("base64");
  if (!base64) return null;
  return `data:${mime};base64,${base64}`;
}

export async function uploadBufferToCloudinary(file, options = {}) {
  assertCloudinaryConfigured();

  const dataUri = bufferToDataUri(file);
  if (!dataUri) {
    throw new Error("Invalid upload: missing file buffer");
  }

  console.log(
    `[cloudinary] upload start name="${file?.originalname}" type="${
      file?.mimetype
    }" bytes=${file?.buffer?.length ?? 0} folder="${options?.folder ?? ""}"`
  );

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "image",
      ...options,
    });

    console.log(
      `[cloudinary] upload ok publicId="${result.public_id}" url="${result.secure_url}"`
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalFilename: file?.originalname,
      contentType: file?.mimetype,
    };
  } catch (err) {
    console.error(
      `[cloudinary] upload failed name="${file?.originalname}" error="${
        err?.message || err
      }"`
    );
    throw err;
  }
}

export default cloudinary;
