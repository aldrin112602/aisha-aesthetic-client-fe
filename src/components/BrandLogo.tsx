export default function BrandLogo({ className = 'h-12 w-12' }: { className?: string }) {
  return <img src="/logo-256.png" alt="AishaEsthetics logo" width={256} height={256}
    className={`object-contain ${className}`} decoding="async" />;
}
