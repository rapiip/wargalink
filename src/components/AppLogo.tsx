import Image from "next/image";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function AppLogo({
  className,
  imageClassName,
  priority = false,
}: AppLogoProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden bg-white",
        className
      )}
    >
      <Image
        src="/wargalink-logo.png"
        alt="WargaLink"
        fill
        sizes="96px"
        priority={priority}
        unoptimized={true}
        className={cn("object-contain", imageClassName)}
      />
    </span>
  );
}
