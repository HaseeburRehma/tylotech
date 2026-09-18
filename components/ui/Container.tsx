import { cn } from "@/lib/cn";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
