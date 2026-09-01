export function Logo({ className = "", size = 36 }: { className?: string; size?: number }) {
  return (
    <img
      src="/redis-logo.png"
      alt="Redis Digital logo"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
