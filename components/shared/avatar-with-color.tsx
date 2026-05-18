import Image from "next/image";
import { cn } from "@/lib/utils";

// Deterministic warm palette from the DESIGN.md token set
const AVATAR_COLORS = [
  { bg: "#ffdbd1", text: "#802a0d" }, // primary-fixed / on-primary-fixed-variant
  { bg: "#ddc0b9", text: "#9c3e21" }, // outline-variant / primary
  { bg: "#eae1dc", text: "#56423c" }, // surface-container-highest / on-surface-variant
  { bg: "#c7c6c4", text: "#34302d" }, // secondary-fixed-dim / inverse-surface
  { bg: "#e3e2df", text: "#464745" }, // secondary-fixed / on-secondary-fixed-variant
  { bg: "#e5e2dc", text: "#474743" }, // tertiary-fixed / on-tertiary-fixed-variant
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

interface AvatarWithColorProps {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-14 h-14 text-base",
  lg: "w-24 h-24 text-2xl",
};

const SIZE_PX = { sm: 32, md: 56, lg: 96 };

export function AvatarWithColor({
  name,
  photoUrl,
  size = "md",
  className,
}: AvatarWithColorProps) {
  const color = getAvatarColor(name);
  const initials = getInitials(name);
  const px = SIZE_PX[size];

  if (photoUrl) {
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden shrink-0",
          SIZE_CLASSES[size],
          className
        )}
      >
        <Image
          src={photoUrl}
          alt={name}
          width={px}
          height={px}
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0",
        SIZE_CLASSES[size],
        className
      )}
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {initials}
    </div>
  );
}
