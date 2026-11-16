import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateImageFile,
  computeResizedDimensions,
  buildStorageObjectPath,
  formatBytes,
} from './imageProcessor';

test('validateImageFile accepts valid JPEG/PNG/WebP and rejects invalid MIME or oversized files', () => {
  assert.deepEqual(
    validateImageFile({ name: 'portrait.jpg', type: 'image/jpeg', size: 500_000 }),
    { valid: true }
  );

  const pdfResult = validateImageFile({ name: 'notes.pdf', type: 'application/pdf', size: 1000 });
  assert.equal(pdfResult.valid, false);
  assert.match(pdfResult.error ?? '', /Unsupported file type/);

  const hugeResult = validateImageFile({
    name: 'raw.png',
    type: 'image/png',
    size: 20 * 1024 * 1024,
  });
  assert.equal(hugeResult.valid, false);
  assert.match(hugeResult.error ?? '', /15 MB/);
});

test('computeResizedDimensions preserves aspect ratio and avoids upscaling', () => {
  assert.deepEqual(computeResizedDimensions(1200, 800, 1800), { width: 1200, height: 800 });
  assert.deepEqual(computeResizedDimensions(3600, 2400, 1800), { width: 1800, height: 1200 });
  assert.deepEqual(computeResizedDimensions(2000, 4000, 1800), { width: 900, height: 1800 });
});

test('buildStorageObjectPath sanitizes folder and filename against traversal', () => {
  const path = buildStorageObjectPath('../Gallery Uploads/', 'My Photo (2026)!!.JPG', 123456, 'abc123');
  assert.equal(path, 'gallery-uploads/123456-abc123-my-photo-2026.webp');
  assert.equal(path.includes('..'), false);
});

test('formatBytes renders readable units', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2 KB');
  assert.equal(formatBytes(2 * 1024 * 1024), '2.00 MB');
});
