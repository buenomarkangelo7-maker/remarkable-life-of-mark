interface BrandMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function BrandMark({ className = '', size = 'md' }: BrandMarkProps) {
  const sizeClass =
    size === 'hero'
      ? 'text-[clamp(2.4rem,4.8vw,4.3rem)] leading-[1.06]'
      : size === 'lg'
        ? 'text-3xl sm:text-4xl leading-tight'
        : size === 'sm'
          ? 'text-lg leading-none'
          : 'text-xl sm:text-[1.35rem] leading-none';

  return (
    <span
      className={`font-editorial tracking-tight text-[#241B15] font-medium ${sizeClass} ${className}`}
    >
      the{' '}
      <span className="italic font-semibold text-[#6F4329]">
        re<span className="not-italic uppercase tracking-[0.04em] font-semibold text-[#7C4A2D]">MARK</span>able
      </span>{' '}
      life of Mark
    </span>
  );
}
