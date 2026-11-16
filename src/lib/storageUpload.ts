import {
  buildStorageObjectPath,
  compressImageFile,
  formatBytes,
  validateImageFile,
} from '../utils/imageProcessor';
import {
  SUPABASE_BUCKET_NAME,
  isSupabaseConfigured,
  supabase,
  supabaseConfigInfo,
} from './supabaseClient';

export interface UploadPhotoProgress {
  phase: 'validating' | 'compressing' | 'uploading' | 'complete';
  percent: number;
  message: string;
}

export interface UploadedPhotoResult {
  publicUrl: string;
  storagePath: string;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
}

/**
 * Validates, compresses, and uploads a photograph to the Supabase Storage bucket "mark-photos"
 * with real byte-level upload progress reporting.
 */
export async function uploadPhotoToMarkBucket(
  rawFile: File,
  folder: string,
  onProgress?: (progress: UploadPhotoProgress) => void
): Promise<UploadedPhotoResult> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment to enable cloud photo uploads.'
    );
  }

  onProgress?.({
    phase: 'validating',
    percent: 5,
    message: `Checking ${rawFile.name}...`,
  });

  const validation = validateImageFile(rawFile);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Administrator sign-in is required before uploading photographs.');
  }

  onProgress?.({
    phase: 'compressing',
    percent: 20,
    message: `Optimizing ${rawFile.name} (${formatBytes(rawFile.size)})...`,
  });

  const compressed = await compressImageFile(rawFile, {
    maxDimension: 1800,
    quality: 0.84,
  });

  const storagePath = buildStorageObjectPath(folder, rawFile.name);
  const encodedPath = storagePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const uploadUrl = `${supabaseConfigInfo.url.replace(/\/$/, '')}/storage/v1/object/${SUPABASE_BUCKET_NAME}/${encodedPath}`;

  onProgress?.({
    phase: 'uploading',
    percent: 35,
    message: `Uploading optimized photograph (${formatBytes(compressed.compressedBytes)})...`,
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('apikey', supabaseConfigInfo.anonKey);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', '3600');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const uploadRatio = event.loaded / event.total;
        const pct = Math.min(98, Math.round(35 + uploadRatio * 63));
        onProgress?.({
          phase: 'uploading',
          percent: pct,
          message: `Uploading (${pct}%) · ${formatBytes(event.loaded)} of ${formatBytes(event.total)}`,
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      let serverMsg = `Upload failed (HTTP ${xhr.status}).`;
      try {
        const parsed = JSON.parse(xhr.responseText);
        if (parsed?.message) {
          serverMsg = parsed.message;
        } else if (parsed?.error) {
          serverMsg = parsed.error;
        }
      } catch {
        // ignore JSON parse errors
      }

      if (xhr.status === 404 || serverMsg.toLowerCase().includes('bucket')) {
        reject(
          new Error(
            `Storage bucket "${SUPABASE_BUCKET_NAME}" was not found. Please run supabase/schema.sql in your Supabase SQL Editor first.`
          )
        );
      } else if (xhr.status === 401 || xhr.status === 403 || serverMsg.toLowerCase().includes('row-level security')) {
        reject(
          new Error(
            'Upload blocked by Storage RLS policy. Confirm your admin email is listed in public.admin_users and your session is active.'
          )
        );
      } else {
        reject(new Error(serverMsg));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error while uploading to Supabase Storage. Please check your connection and try again.'));
    };

    const formData = new FormData();
    formData.append('cacheControl', '3600');
    formData.append('', compressed.file, compressed.file.name);
    xhr.send(compressed.file);
  });

  const { data: publicData } = supabase.storage
    .from(SUPABASE_BUCKET_NAME)
    .getPublicUrl(storagePath);

  onProgress?.({
    phase: 'complete',
    percent: 100,
    message: `Uploaded (${formatBytes(compressed.originalBytes)} -> ${formatBytes(compressed.compressedBytes)})`,
  });

  return {
    publicUrl: publicData.publicUrl,
    storagePath,
    originalBytes: compressed.originalBytes,
    compressedBytes: compressed.compressedBytes,
    width: compressed.width,
    height: compressed.height,
  };
}

/**
 * Removes an uploaded photograph from the Supabase "mark-photos" bucket when deleting a record.
 */
export async function deletePhotoFromMarkBucket(storagePath: string): Promise<void> {
  if (!storagePath || !isSupabaseConfigured || !supabase) {
    return;
  }
  const { error } = await supabase.storage.from(SUPABASE_BUCKET_NAME).remove([storagePath]);
  if (error) {
    console.warn('Could not remove file from Supabase Storage:', error.message);
  }
}
