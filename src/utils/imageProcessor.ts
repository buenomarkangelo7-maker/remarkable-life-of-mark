export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_RAW_FILE_BYTES = 15 * 1024 * 1024; // 15 MB pre-compression limit
export const MAX_STORAGE_FILE_BYTES = 5 * 1024 * 1024; // 5 MB post-compression limit (matches bucket)

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface CompressedImageResult {
  file: File;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
}

/**
 * Validates file MIME type and size before reading or uploading.
 */
export function validateImageFile(
  file: { type: string; size: number; name: string }
): FileValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      valid: false,
      error: `Unsupported file type for "${file.name}". Please choose a JPG, PNG, or WebP photograph.`,
    };
  }
  if (file.size <= 0) {
    return {
      valid: false,
      error: `"${file.name}" appears to be empty.`,
    };
  }
  if (file.size > MAX_RAW_FILE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 15 MB selection limit. Please choose a smaller photograph.`,
    };
  }
  return { valid: true };
}

/**
 * Pure aspect-preserving resize math.
 */
export function computeResizedDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  if (width <= 0 || height <= 0 || maxDimension <= 0) {
    return { width: 1, height: 1 };
  }
  if (width <= maxDimension && height <= maxDimension) {
    return { width: Math.round(width), height: Math.round(height) };
  }
  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Generates a safe, collision-resistant storage object path inside the "mark-photos" bucket.
 */
export function buildStorageObjectPath(
  folder: string,
  originalName: string,
  timestamp = Date.now(),
  randomSuffix = Math.random().toString(36).slice(2, 8)
): string {
  const safeFolder = folder
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'uploads';

  const baseName = originalName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'photo';

  return `${safeFolder}/${timestamp}-${randomSuffix}-${baseName}.webp`;
}

/**
 * Formats byte sizes nicely (e.g. "2.4 MB", "310 KB").
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Compresses an image in the browser using HTML5 Canvas while preserving visual quality.
 * Converts to WebP (or falls back to JPEG) at max 1800px on the longest edge.
 */
export async function compressImageFile(
  file: File,
  options: { maxDimension?: number; quality?: number } = {}
): Promise<CompressedImageResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const maxDimension = options.maxDimension ?? 1800;
  const quality = options.quality ?? 0.84;

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Could not decode the selected image file.'));
      element.src = objectUrl;
    });

    const target = computeResizedDimensions(img.naturalWidth, img.naturalHeight, maxDimension);
    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser canvas compression context is unavailable.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, target.width, target.height);

    const outputMime = 'image/webp';
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            canvas.toBlob(
              (jpegBlob) =>
                jpegBlob
                  ? resolve(jpegBlob)
                  : reject(new Error('Image compression failed.')),
              'image/jpeg',
              quality
            );
          }
        },
        outputMime,
        quality
      );
    });

    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const cleanStem = file.name.replace(/\.[^.]+$/, '') || 'photo';
    const compressedFile = new File([blob], `${cleanStem}.${ext}`, {
      type: blob.type,
      lastModified: Date.now(),
    });

    if (compressedFile.size > MAX_STORAGE_FILE_BYTES) {
      throw new Error(
        `Compressed image (${formatBytes(compressedFile.size)}) still exceeds the 5 MB bucket limit. Try a smaller photograph.`
      );
    }

    return {
      file: compressedFile,
      originalBytes: file.size,
      compressedBytes: compressedFile.size,
      width: target.width,
      height: target.height,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
