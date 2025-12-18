"use client";

import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAddHistory } from "@/features/history";
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { useDeleteCartItem } from "@/hooks/use-delete-cart-item";
import { type CartItem, useGetCart } from "@/hooks/use-get-cart";
import { useSession } from "@/hooks/use-session";
import { useUpdateCartItem } from "@/hooks/use-update-cart-item";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import sparLogo from "../../../public/images/spar.jpeg";
import { Button } from "../button";

const storeLogos: Record<string, StaticImageData> = {
  spar: sparLogo,
  europroduct: europroductLogo,
  goodwill: goodwillLogo,
  ioli: ioliLogo,
  magniti: magnitiLogo,
  nikora: nikoraLogo,
  carrefour: carrefourLogo,
};

function getStoreLogo(storeName: string): StaticImageData | null {
  const name = storeName.toLowerCase();
  if (storeLogos[name]) return storeLogos[name];
  const firstWord = name.split(" ")[0];
  return storeLogos[firstWord] ?? null;
}

type GroupedItems = Record<string, CartItem[]>;

function groupItemsByStore(items: CartItem[]): GroupedItems {
  return items.reduce((acc, item) => {
    const store = item.store_name;
    if (!acc[store]) {
      acc[store] = [];
    }
    acc[store].push(item);
    return acc;
  }, {} as GroupedItems);
}

export function Cart() {
  const { status } = useSession();
  const { data: cart, isLoading } = useGetCart();
  const { mutate: clearCart, isPending: isClearingCart } = useDeleteCart();
  const { mutate: addToHistory, isPending: isAddingToHistory } =
    useAddHistory();

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-sage)] border-t-[var(--color-yellow)]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)]">
        <ShoppingBag
          size={64}
          className="text-[var(--color-dark-green)] opacity-30"
        />
        <h1 className="font-bold text-2xl text-[var(--color-dark-green)]">
          Sign in to view your cart
        </h1>
        <Link
          href="/sign-in"
          className="rounded-full bg-[var(--color-yellow)] px-6 py-3 font-semibold text-[var(--color-dark-green)] shadow-md transition-all hover:bg-[var(--color-yellow)]/80"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)]">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-dark-green)] bg-white text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-cream)] active:scale-95"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="font-bold text-2xl text-[var(--color-dark-green)] sm:text-3xl">
                Shopping Cart
              </h1>
            </div>
            <Link
              href="/history"
              className="flex items-center gap-2 rounded-full border-2 border-[var(--color-dark-green)] bg-white px-4 py-2 font-semibold text-[var(--color-dark-green)] text-sm transition-all hover:bg-[var(--color-cream)] active:scale-95"
            >
              <Clock size={16} />
              View History
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left side - Empty state */}
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-[var(--color-dark-green)] border-dashed bg-white p-12">
              <ShoppingBag
                size={64}
                className="text-[var(--color-dark-green)] opacity-30"
              />
              <h2 className="font-bold text-2xl text-[var(--color-dark-green)]">
                Your cart is empty
              </h2>
              <p className="text-[var(--color-dark-green)] opacity-60">
                Start shopping to add items to your cart
              </p>
              <Link
                href="/"
                className="rounded-full bg-[var(--color-yellow)] px-6 py-3 font-semibold text-[var(--color-dark-green)] shadow-md transition-all hover:bg-[var(--color-yellow)]/80"
              >
                Browse Products
              </Link>
            </div>

            {/* Right side - Order summary with zero values */}
            <div className="lg:w-80">
              <div className="sticky top-6 rounded-xl border-2 border-[var(--color-dark-green)] bg-white p-6 shadow-lg">
                <h2 className="mb-4 font-bold text-[var(--color-dark-green)] text-lg">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-[var(--color-dark-green)]">
                    <span className="opacity-70">Original Price</span>
                    <span className="line-through opacity-50">₾0.00</span>
                  </div>

                  <div className="flex justify-between text-[var(--color-dark-green)]">
                    <span className="opacity-70">Sale Price</span>
                    <span className="font-semibold">₾0.00</span>
                  </div>

                  <div className="border-[var(--color-sage)] border-t pt-3">
                    <div className="flex justify-between text-[var(--color-dark-green)]">
                      <span className="font-semibold">You Save</span>
                      <span className="font-bold text-[var(--color-orange)]">
                        ₾0.00
                      </span>
                    </div>
                    <div className="mt-1 text-right">
                      <span className="rounded-full bg-[var(--color-orange)] px-2 py-0.5 font-bold text-white text-xs">
                        0% OFF
                      </span>
                    </div>
                  </div>

                  <div className="border-[var(--color-dark-green)] border-t-2 pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-[var(--color-dark-green)] text-lg">
                        Total
                      </span>
                      <span className="font-bold text-[var(--color-orange)] text-xl">
                        ₾0.00
                      </span>
                    </div>
                    <p className="mt-1 text-[var(--color-dark-green)] text-xs opacity-50">
                      0 items
                    </p>
                  </div>
                </div>

                <Button
                  disabled
                  className="mt-6 w-full rounded-full bg-[var(--color-yellow)] py-3 font-bold text-[var(--color-dark-green)] shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to History
                </Button>
                <p className="mt-2 text-center text-[var(--color-dark-green)] text-xs opacity-60">
                  Adding to history will clear your cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClearCart = () => {
    clearCart(undefined, {
      onSuccess: () => {
        toast.success("Cart cleared");
      },
      onError: () => {
        toast.error("Failed to clear cart");
      },
    });
  };

  const handleAddToHistory = () => {
    const productIds = cart.items.map((item) => item.product_id);
    addToHistory(productIds, {
      onSuccess: () => {
        clearCart(undefined, {
          onSuccess: () => {
            toast.success("Added to history and cart cleared");
          },
          onError: () => {
            toast.success("Added to history");
            toast.error("Failed to clear cart");
          },
        });
      },
      onError: () => {
        toast.error("Failed to add to history");
      },
    });
  };

  const groupedItems = groupItemsByStore(cart.items);
  const unavailableCount = cart.items.filter(
    (item) => item.is_available === false,
  ).length;
  const totalOriginalPrice = cart.items.reduce(
    (sum, item) => sum + item.original_price * item.quantity,
    0,
  );
  const totalCurrentPrice = cart.total_price;
  const totalSavings = totalOriginalPrice - totalCurrentPrice;
  const savingsPercent =
    totalOriginalPrice > 0
      ? Math.round((totalSavings / totalOriginalPrice) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-dark-green)] bg-white text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-cream)] active:scale-95"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-2xl text-[var(--color-dark-green)] sm:text-3xl">
              Shopping Cart
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/history"
              className="flex items-center gap-2 rounded-full border-2 border-[var(--color-dark-green)] bg-white px-4 py-2 font-semibold text-[var(--color-dark-green)] text-sm transition-all hover:bg-[var(--color-cream)] active:scale-95"
            >
              <Clock size={16} />
              View History
            </Link>
            <Button
              onClick={handleClearCart}
              disabled={isClearingCart}
              className="flex items-center gap-2 rounded-full border-2 border-red-500 bg-white px-4 py-2 font-semibold text-red-500 text-sm transition-all hover:bg-red-50 active:scale-95 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left side - Store groups */}
          <div className="flex-1 space-y-4">
            {unavailableCount > 0 && (
              <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-500 p-1.5 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-label="Warning"
                    >
                      <title>Warning</title>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900">
                      {unavailableCount}{" "}
                      {unavailableCount === 1 ? "item" : "items"} no longer
                      available
                    </h3>
                    <p className="mt-1 text-amber-800 text-sm">
                      Some products in your cart are currently unavailable and
                      cannot be purchased.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {Object.entries(groupedItems).map(([storeName, items]) => (
              <StoreGroup key={storeName} storeName={storeName} items={items} />
            ))}
          </div>

          {/* Right side - Order summary */}
          <div className="lg:w-80">
            <div className="sticky top-6 rounded-xl border-2 border-[var(--color-dark-green)] bg-white p-6 shadow-lg">
              <h2 className="mb-4 font-bold text-[var(--color-dark-green)] text-lg">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-[var(--color-dark-green)]">
                  <span className="opacity-70">Original Price</span>
                  <span className="line-through opacity-50">
                    ₾{totalOriginalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[var(--color-dark-green)]">
                  <span className="opacity-70">Sale Price</span>
                  <span className="font-semibold">
                    ₾{totalCurrentPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-[var(--color-sage)] border-t pt-3">
                  <div className="flex justify-between text-[var(--color-dark-green)]">
                    <span className="font-semibold">You Save</span>
                    <span className="font-bold text-[var(--color-orange)]">
                      ₾{totalSavings.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 text-right">
                    <span className="rounded-full bg-[var(--color-orange)] px-2 py-0.5 font-bold text-white text-xs">
                      {savingsPercent}% OFF
                    </span>
                  </div>
                </div>

                <div className="border-[var(--color-dark-green)] border-t-2 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-[var(--color-dark-green)] text-lg">
                      Total
                    </span>
                    <span className="font-bold text-[var(--color-orange)] text-xl">
                      ₾{totalCurrentPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-[var(--color-dark-green)] text-xs opacity-50">
                    {cart.total_items} item{cart.total_items !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddToHistory}
                disabled={isAddingToHistory || isClearingCart}
                className="mt-6 w-full rounded-full bg-[var(--color-yellow)] py-3 font-bold text-[var(--color-dark-green)] shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled)]:hover:bg-[var(--color-yellow)]/80 [&:not(:disabled)]:active:scale-95"
              >
                {isAddingToHistory ? "Adding..." : "Add to History"}
              </Button>
              <p className="mt-2 text-center text-[var(--color-dark-green)] text-xs opacity-60">
                Adding to history will clear your cart
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreGroup({
  storeName,
  items,
}: {
  storeName: string;
  items: CartItem[];
}) {
  const [isOpen, setIsOpen] = useState(true);
  const logo = getStoreLogo(storeName);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const displayName = storeName.split(" ")[0];

  return (
    <div className="overflow-hidden rounded-xl border-2 border-[var(--color-dark-green)] bg-white shadow-md">
      {/* Store header - clickable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-[var(--color-cream)]"
      >
        <div className="flex items-center gap-3">
          {logo && (
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow-md">
              <Image
                src={logo}
                alt={storeName}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="text-left">
            <h3 className="font-bold text-[var(--color-dark-green)] text-lg">
              {displayName}
            </h3>
            <p className="text-[var(--color-dark-green)] text-sm opacity-60">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <ChevronDown
          size={24}
          className={`text-[var(--color-dark-green)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Items dropdown */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-[var(--color-sage)] border-t p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteCartItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const isUnavailable = item.is_available === false;

  const handleDelete = () => {
    deleteItem(item.id);
  };

  const handleIncrement = () => {
    if (isUnavailable) return;
    updateItem({ itemId: item.id, quantity: item.quantity + 1 });
  };

  const handleDecrement = () => {
    if (isUnavailable) return;
    if (item.quantity > 1) {
      updateItem({ itemId: item.id, quantity: item.quantity - 1 });
    } else {
      deleteItem(item.id);
    }
  };

  const isPending = isDeleting || isUpdating;

  return (
    <div
      className={`flex gap-4 rounded-lg p-3 ${isUnavailable ? "bg-gray-100" : "bg-[var(--color-cream)]"}`}
    >
      {/* Product Image */}
      <div
        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white ${isUnavailable ? "opacity-50" : ""}`}
      >
        {item.product_image_url ? (
          <Image
            src={item.product_image_url}
            alt={item.product_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-dark-green)] text-xs opacity-50">
            No Image
          </div>
        )}
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-red-500 px-2 py-0.5 font-bold text-white text-xs">
              UNAVAILABLE
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4
            className={`line-clamp-2 font-semibold text-sm ${isUnavailable ? "text-gray-500 line-through" : "text-[var(--color-dark-green)]"}`}
          >
            {item.product_name}
          </h4>
          {isUnavailable ? (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700 text-xs">
                This item is no longer available
              </span>
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="font-bold text-[var(--color-orange)]">
                ₾{item.current_price.toFixed(2)}
              </span>
              <span className="text-[var(--color-dark-green)] text-xs line-through opacity-50">
                ₾{item.original_price.toFixed(2)}
              </span>
              <span className="rounded-full bg-[var(--color-orange)] px-1.5 py-0.5 font-bold text-white text-xs">
                -{item.discount_percent}%
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between">
          {/* Quantity Controls */}
          {isUnavailable ? (
            <div className="flex items-center gap-2 opacity-50">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300">
                <Minus size={14} className="text-gray-500" />
              </div>
              <span className="min-w-[1.5rem] text-center font-bold text-gray-500">
                {item.quantity}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300">
                <Plus size={14} className="text-gray-500" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDecrement}
                disabled={isPending}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-yellow)] text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-yellow)]/80 active:scale-95 disabled:opacity-50"
              >
                <Minus size={14} />
              </Button>
              <span className="min-w-[1.5rem] text-center font-bold text-[var(--color-dark-green)]">
                {item.quantity}
              </span>
              <Button
                onClick={handleIncrement}
                disabled={isPending}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-yellow)] text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-yellow)]/80 active:scale-95 disabled:opacity-50"
              >
                <Plus size={14} />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isUnavailable && (
              <span className="font-bold text-[var(--color-dark-green)]">
                ₾{item.subtotal.toFixed(2)}
              </span>
            )}
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
              title="Remove from cart"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
