import React, { useId, useState } from 'react';
import { AlertCircle, CheckCircle2, ImagePlus, Loader2 } from 'lucide-react';
import { uploadPhotoToMarkBucket, type UploadPhotoProgress } from '../lib/storageUpload';
import { formatBytes } from '../utils/imageProcessor';

interface ImageUploadControlProps {
  label: string;
  folder: string;
  multiple?: boolean;
  onUploaded: (result: { publicUrl: string; storagePath: string; fileName: string }) => void | Promise<void>;
  disabled?: boolean;
  helperText?: string;
}

export function ImageUploadControl({
  label,
  folder,
  multiple = false,
  onUploaded,
  disabled = false,
  helperText,
}: ImageUploadControlProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadPhotoProgress | null>(null);
  const [queueSummary, setQueueSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setError(null);
    setSuccessMsg(null);
    setUploading(true);

    let uploadedCount = 0;
    let totalSavedBytes = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setQueueSummary(files.length > 1 ? `Photo ${i + 1} of ${files.length}` : null);
        const result = await uploadPhotoToMarkBucket(file, folder, (p) => setProgress(p));
        totalSavedBytes += Math.max(0, result.originalBytes - result.compressedBytes);
        await onUploaded({
          publicUrl: result.publicUrl,
          storagePath: result.storagePath,
          fileName: file.name,
        });
        uploadedCount++;
      }

      setSuccessMsg(
        uploadedCount === 1
          ? `Uploaded to "mark-photos" (${totalSavedBytes > 0 ? `saved ${formatBytes(totalSavedBytes)}` : 'optimized'}).`
          : `Uploaded ${uploadedCount} photographs to "mark-photos" (saved ${formatBytes(totalSavedBytes)} total).`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photograph upload failed.');
    } finally {
      setUploading(false);
      setQueueSummary(null);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            disabled || uploading
              ? 'bg-[#E6DDD0] text-[#8A7768] cursor-not-allowed'
              : 'bg-[#241B15] text-[#FAF7F2] hover:bg-[#3A2C23]'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{uploading ? 'Optimizing & Uploading...' : label}</span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          disabled={disabled || uploading}
          onChange={handleFileChange}
          className="sr-only"
        />
        {helperText && (
          <span className="text-xs text-[#7C6A5C]">{helperText}</span>
        )}
      </div>

      {uploading && progress && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E3DACD] space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-[#4A3B31]">
            <span className="font-medium">
              {queueSummary ? `${queueSummary} · ${progress.message}` : progress.message}
            </span>
            <span className="tabular-nums font-semibold">{progress.percent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E3DACD] overflow-hidden">
            <div
              className="h-full bg-[#7C4A2D] transition-all duration-150"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-lg bg-[#FDF2F0] border border-[#E6B8B0] text-xs text-[#8C2D1E]"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && !uploading && (
        <div
          role="status"
          className="flex items-start gap-2 p-3 rounded-lg bg-[#F2F6F0] border border-[#C6D4BF] text-xs text-[#3D5235]"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
