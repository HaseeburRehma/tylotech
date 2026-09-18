import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "dark" | "light" | "outline";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-[10px] px-7 py-4 text-[16px] font-medium leading-5 tracking-[-0.01em] transition-colors duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  dark: "bg-[#002e3d] text-inverse hover:bg-[#013a4d]",
  light: "bg-inverse text-ink hover:bg-white/90",
  outline:
    "border border-white/25 text-inverse hover:bg-white/10 hover:border-white/40",
};

export default function Button({
  href = "#",
  variant = "dark",
  withArrow = false,
  className,
  children,
}: {
  href?: string;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
      {withArrow && (
        <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
