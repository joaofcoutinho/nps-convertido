import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES: Record<NonNullable<LogoProps["size"]>, { h: number; w: number }> = {
  sm: { h: 56, w: 49 },
  md: { h: 72, w: 63 },
  lg: { h: 104, w: 92 },
};

export function Logo({ href = "/", size = "md" }: LogoProps) {
  const { h, w } = SIZES[size];

  const content = (
    <Image
      src="/convertido-logo.webp"
      alt="Convertido"
      width={w}
      height={h}
      priority
      className="block select-none"
    />
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Convertido" className="inline-block focus-visible:outline-none">
      {content}
    </Link>
  );
}
