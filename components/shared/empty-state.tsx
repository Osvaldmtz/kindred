import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#f5ece8] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-[#9c3e21]" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-[#1f1b18] mb-2">{title}</h3>
      <p className="text-sm text-[#56423c] mb-6 max-w-[240px] leading-relaxed">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className="bg-[#9c3e21] hover:bg-[#802a0d] text-white rounded-2xl px-6 py-3 font-semibold text-sm transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
