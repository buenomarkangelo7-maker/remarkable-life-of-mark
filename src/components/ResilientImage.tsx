import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  aspectClass?: string;
}

export function resolveAppAssetUrl(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('/src/assets/')) {
    return `${import.meta.env.BASE_URL}${src.slice(1)}`;
  }
  return src;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  aspectClass = '',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveAppAssetUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F1EAE0] via-[#E8DEC8] to-[#DFD2BE] text-[#6E5C4E] p-6 text-center ${aspectClass} ${className}`}
      >
        <ImageOff className="w-6 h-6 mb-2 opacity-60" aria-hidden="true" />
        <p className="font-editorial italic text-base text-[#4A3B31] max-w-[22ch]">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${aspectClass} ${className}`}
    />
  );
}
