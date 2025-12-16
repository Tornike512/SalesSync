import {
  Apple,
  Baby,
  Beef,
  Candy,
  Carrot,
  Coffee,
  Cookie,
  Croissant,
  Fish,
  Heart,
  type LucideIcon,
  Milk,
  Package,
  PawPrint,
  Salad,
  ShoppingBasket,
  Snowflake,
  Soup,
  Sparkles,
  Wine,
} from "lucide-react";

// Icon mapping for categories from API
export const categoryIcons: Record<string, LucideIcon> = {
  "Dairy & Eggs": Milk,
  Meat: Beef,
  "Fish & Seafood": Fish,
  Fruits: Apple,
  Vegetables: Carrot,
  Bakery: Croissant,
  Beverages: Coffee,
  Alcohol: Wine,
  Snacks: Cookie,
  "Sweets & Confectionery": Candy,
  "Frozen Foods": Snowflake,
  "Grocery & Pantry": ShoppingBasket,
  "Baby & Kids": Baby,
  "Pet Supplies": PawPrint,
  "Household & Cleaning": Sparkles,
  "Personal Care": Heart,
  "Asian & International": Soup,
  "Health & Organic": Salad,
};

// Helper to get icon for category
export function getCategoryIcon(categoryName: string): LucideIcon {
  return categoryIcons[categoryName] ?? Package;
}
