import { icons, type IconName } from '@/lib/icons';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  label?: string;
}

/** React twin of components/ui/Icon.astro — same path data, no innerHTML. */
export function Icon({ name, className, size, label }: IconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      {icons[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
