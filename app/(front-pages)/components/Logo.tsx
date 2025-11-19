// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  /** Extra sizing/utility classes */
  className?: string;
  /** Wrap logo in <Link> to "/" (default true) */
  asLink?: boolean;
};

const Logo = ({ className = "w-16 h-16", asLink = true }: LogoProps) => {
  const inner = (
    <div className={`relative ${className}`}>
      <Image
        src="/pullman-logo.png"
        alt="Pullman logo"
        fill
        priority
        className="object-contain"
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label="Back to Aurelia Haven home"
        className="inline-flex items-center"
      >
        {inner}
      </Link>
    );
  }

  // Plain, non-link logo (for intro, etc.)
  return inner;
};

export default Logo;
