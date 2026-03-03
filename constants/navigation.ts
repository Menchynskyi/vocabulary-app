import { BarChart3, Layers3, Link2, MessageSquareText, Wand } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export type NavLink = {
  path: string;
  label: string;
  icon: LucideIcon;
  authGated?: boolean;
  isActive?: (pathname: string) => boolean;
};

export const navLinks: NavLink[] = [
  {
    path: "/",
    label: "Cards",
    icon: Layers3,
    isActive: (pathname) => pathname === "/" || pathname.startsWith("/edit-card"),
  },
  {
    path: "/match-up",
    label: "Match up",
    icon: Link2,
  },
  {
    path: "/blanks",
    label: "Blanks",
    icon: Wand,
  },
  {
    path: "/context",
    label: "Context",
    icon: MessageSquareText,
    authGated: true,
  },
  {
    path: "/stats",
    label: "Stats",
    icon: BarChart3,
    authGated: true,
  },
];
