import type { Metadata } from "next";
import { Cart } from "@/components/cart";

export const metadata: Metadata = {
  title: "Cart - SaleSync",
  description: "View your cart",
};

export default function CartPage() {
  return <Cart />;
}
