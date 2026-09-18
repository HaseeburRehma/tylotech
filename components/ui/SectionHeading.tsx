import { cn } from "@/lib/cn";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  headingClassName,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div className={cn("max-w-[640px]", className)}>
      <p className="eyebrow mb-[18px] flex items-center gap-2.5 text-[#94713f]">
        <span className="size-[7px] rounded-[2px] bg-accent" />
        {eyebrow}
      </p>
      <h2 className={cn("display-m text-ink", headingClassName)}>{title}</h2>
      {subtitle && (
        <p className="mt-[18px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#5c5954]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
