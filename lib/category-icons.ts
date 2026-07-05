import {
  ShoppingCart,
  Home,
  Plug,
  UtensilsCrossed,
  Car,
  Clapperboard,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Laptop,
  Tag,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  ShoppingCart,
  Home,
  Plug,
  UtensilsCrossed,
  Car,
  Clapperboard,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Laptop,
  Tag,
};

export function getCategoryIcon(name: string): LucideIcon {
  return map[name] ?? Tag;
}
