"use client";

import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useAddHistory } from "@/features/history";
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { useDeleteCartItem } from "@/hooks/use-delete-cart-item";
import { type CartItem, useGetCart } from "@/hooks/use-get-cart";
import { useSession } from "@/hooks/use-session";
import { useUpdateCartItem } from "@/hooks/use-update-cart-item";
import agrohubLogo from "../../../public/images/agrohub.png";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import gvirilaLogo from "../../../public/images/Gvirila.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import onePriceLogo from "../../../public/images/one-price.png";
import oriNabijiLogo from "../../../public/images/ori-nabiji.webp";
import sparLogo from "../../../public/images/spar.jpeg";
import { Button } from "../button";

const storeLogos: Record<string, StaticImageData> = {
  agrohub: agrohubLogo,
  carrefour: carrefourLogo,
  europroduct: europroductLogo,
  goodwill: goodwillLogo,
  gvirila: gvirilaLogo,
  ioli: ioliLogo,
  magniti: magnitiLogo,
  nikora: nikoraLogo,
  oneprice: onePriceLogo,
  orinabiji: oriNabijiLogo,
  spar: sparLogo,
};

function getStoreLogo(storeName: string): StaticImageData | null {
  const name = storeName.toLowerCase();
  if (storeLogos[name]) return storeLogos[name];

  const normalizedName = name.replace(/[\s-]/g, "");
  if (storeLogos[normalizedName]) return storeLogos[normalizedName];

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

interface PendingUpdatesContextValue {
  readonly pendingCount: number;
  readonly registerPending: () => void;
  readonly unregisterPending: () => void;
}

const PendingUpdatesContext = createContext<PendingUpdatesContextValue>({
  pendingCount: 0,
  registerPending: () => {},
  unregisterPending: () => {},
});

function usePendingUpdates(): PendingUpdatesContextValue {
  return useContext(PendingUpdatesContext);
}

export function Cart() {
  const { status } = useSession();
  const { data: cart, isLoading } = useGetCart();
  const { mutate: clearCart, isPending: isClearingCart } = useDeleteCart();
  const { mutate: addToHistory, isPending: isAddingToHistory } =
    useAddHistory();

  const [pendingCount, setPendingCount] = useState(0);

  const registerPending = useCallback((): void => {
    setPendingCount((prev) => prev + 1);
  }, []);

  const unregisterPending = useCallback((): void => {
    setPendingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const pendingUpdatesValue = useMemo(
    () => ({
      pendingCount,
      registerPending,
      unregisterPending,
    }),
    [pendingCount, registerPending, unregisterPending],
  );

  const hasPendingUpdates = pendingCount > 0;

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background-100)]">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--background-300)] border-t-[var(--accent-primary)]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--background-100)] p-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--background-200)]">
          <ShoppingBag size={40} className="text-[var(--foreground-300)]" />
        </div>
        <h1 className="font-bold font-display text-2xl text-[var(--foreground-100)]">
          Sign in to view your cart
        </h1>
        <Link href="/sign-in">
          <Button variant="primary" size="lg" className="rounded-full px-8">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background-100)]">
        <div className="mx-auto max-w-7xl p-4 lg:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="font-bold font-display text-2xl text-[var(--foreground-100)] lg:text-3xl">
                Shopping Cart
              </h1>
            </div>
            <Link
              href="/history"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-[var(--background-200)] px-4 py-2.5 font-medium text-[var(--foreground-100)] text-sm transition-all hover:bg-[var(--background-300)]"
            >
              <Clock size={16} />
              <span className="hidden lg:inline">View History</span>
              <span className="lg:hidden">History</span>
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left side - Empty state */}
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-[var(--background-300)] border-dashed bg-white p-8 text-center lg:p-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--background-200)]">
                <ShoppingBag
                  size={40}
                  className="text-[var(--foreground-300)]"
                />
              </div>
              <h2 className="font-display font-semibold text-[var(--foreground-100)] text-xl">
                Your cart is empty
              </h2>
              <p className="text-[var(--foreground-200)] text-sm">
                Start shopping to add items to your cart
              </p>
              <Link href="/">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-full px-6"
                >
                  Browse Products
                </Button>
              </Link>
            </div>

            {/* Right side - Order summary with zero values */}
            <div className="lg:w-80">
              <div className="sticky top-6 rounded-xl border border-[var(--background-300)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <h2 className="mb-4 font-display font-semibold text-[var(--foreground-100)] text-lg">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-200)]">
                      Original Price
                    </span>
                    <span className="text-[var(--foreground-300)] line-through">
                      ₾0.00
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-200)]">
                      Sale Price
                    </span>
                    <span className="font-medium text-[var(--foreground-100)]">
                      ₾0.00
                    </span>
                  </div>

                  <div className="border-[var(--background-300)] border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-[var(--foreground-100)]">
                        You Save
                      </span>
                      <span className="font-semibold text-[var(--accent-sage)]">
                        ₾0.00
                      </span>
                    </div>
                    <div className="mt-1 text-right">
                      <span className="rounded-full bg-[var(--accent-coral-soft)] px-2 py-0.5 font-semibold text-[var(--accent-coral)] text-xs">
                        0% OFF
                      </span>
                    </div>
                  </div>

                  <div className="border-[var(--background-300)] border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--foreground-100)]">
                        Total
                      </span>
                      <span className="font-bold font-display text-[var(--foreground-100)] text-xl">
                        ₾0.00
                      </span>
                    </div>
                    <p className="mt-1 text-[var(--foreground-300)] text-xs">
                      0 items
                    </p>
                  </div>
                </div>

                <Button
                  disabled
                  variant="primary"
                  className="mt-6 w-full rounded-xl py-3"
                >
                  Add to History
                </Button>
                <p className="mt-2 text-center text-[var(--foreground-300)] text-xs">
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
    const historyItems = cart.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    addToHistory(historyItems, {
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
    <div className="min-h-screen bg-[var(--background-100)]">
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold font-display text-2xl text-[var(--foreground-100)] lg:text-3xl">
              Shopping Cart
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/history"
              className="flex items-center gap-2 rounded-xl bg-[var(--background-200)] px-4 py-2.5 font-medium text-[var(--foreground-100)] text-sm transition-all hover:bg-[var(--background-300)]"
            >
              <Clock size={16} />
              <span className="hidden lg:inline">View History</span>
              <span className="lg:hidden">History</span>
            </Link>
            <Button
              onClick={handleClearCart}
              disabled={isClearingCart}
              variant="danger"
              size="md"
              className="rounded-xl"
            >
              <Trash2 size={16} />
              <span className="hidden lg:inline">Clear Cart</span>
              <span className="lg:hidden">Clear</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left side - Store groups */}
          <div className="flex-1 space-y-4">
            {unavailableCount > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-amber-500 p-1.5 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                    <h3 className="font-semibold text-amber-900 text-sm">
                      {unavailableCount}{" "}
                      {unavailableCount === 1 ? "item" : "items"} no longer
                      available
                    </h3>
                    <p className="mt-0.5 text-amber-700 text-sm">
                      Some products in your cart are currently unavailable.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <PendingUpdatesContext.Provider value={pendingUpdatesValue}>
              {Object.entries(groupedItems).map(([storeName, items]) => (
                <StoreGroup
                  key={storeName}
                  storeName={storeName}
                  items={items}
                />
              ))}
            </PendingUpdatesContext.Provider>
          </div>

          {/* Right side - Order summary */}
          <div className="lg:w-80">
            <div className="sticky top-6 rounded-xl border border-[var(--background-300)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display font-semibold text-[var(--foreground-100)] text-lg">
                  Order Summary
                </h2>
                {hasPendingUpdates && (
                  <Loader2
                    size={18}
                    className="animate-spin text-[var(--accent-primary)]"
                  />
                )}
              </div>

              <div
                className={`space-y-3 text-sm transition-opacity ${hasPendingUpdates ? "opacity-50" : "opacity-100"}`}
              >
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-200)]">
                    Original Price
                  </span>
                  <span className="text-[var(--foreground-300)] line-through">
                    ₾{totalOriginalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--foreground-200)]">
                    Sale Price
                  </span>
                  <span className="font-medium text-[var(--foreground-100)]">
                    ₾{totalCurrentPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-[var(--background-300)] border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-[var(--foreground-100)]">
                      You Save
                    </span>
                    <span className="font-semibold text-[var(--accent-sage)]">
                      ₾{totalSavings.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 text-right">
                    <span className="rounded-full bg-[var(--accent-coral-soft)] px-2 py-0.5 font-semibold text-[var(--accent-coral)] text-xs">
                      {savingsPercent}% OFF
                    </span>
                  </div>
                </div>

                <div className="border-[var(--background-300)] border-t pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[var(--foreground-100)]">
                      Total
                    </span>
                    <span className="font-bold font-display text-[var(--foreground-100)] text-xl">
                      ₾{totalCurrentPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-[var(--foreground-300)] text-xs">
                    {cart.total_items} item{cart.total_items !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddToHistory}
                disabled={
                  isAddingToHistory || isClearingCart || hasPendingUpdates
                }
                variant="primary"
                className="mt-6 w-full rounded-xl py-3"
              >
                {isAddingToHistory ? "Adding..." : "Add to History"}
              </Button>
              <p className="mt-2 text-center text-[var(--foreground-300)] text-xs">
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
    <div className="overflow-hidden rounded-xl border border-[var(--background-300)] bg-white shadow-[var(--shadow-sm)]">
      {/* Store header - clickable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-[var(--background-100)]"
      >
        <div className="flex items-center gap-3">
          {logo && (
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow-[var(--shadow-sm)]">
              <Image
                src={logo}
                alt={storeName}
                fill
                className="object-contain p-0.5"
              />
            </div>
          )}
          <div className="text-left">
            <h3 className="font-semibold text-[var(--foreground-100)]">
              {displayName}
            </h3>
            <p className="text-[var(--foreground-200)] text-sm">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <ChevronDown
          size={20}
          className={`text-[var(--foreground-300)] transition-transform ${
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
          <div className="border-[var(--background-300)] border-t p-4">
            <div className="space-y-3">
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
  const { registerPending, unregisterPending } = usePendingUpdates();
  const isUnavailable = item.is_available === false;

  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChangedRef = useRef(false);
  const isPendingRegisteredRef = useRef(false);

  useEffect(() => {
    if (!hasChangedRef.current) {
      setLocalQuantity(item.quantity);
    }
  }, [item.quantity]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (isPendingRegisteredRef.current) {
        unregisterPending();
        isPendingRegisteredRef.current = false;
      }
    };
  }, [unregisterPending]);

  const handleDelete = (): void => {
    if (isPendingRegisteredRef.current) {
      unregisterPending();
      isPendingRegisteredRef.current = false;
    }
    deleteItem(item.id);
  };

  const handleQuantityChange = (newQuantity: number): void => {
    if (isUnavailable) return;

    if (newQuantity < 1) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (isPendingRegisteredRef.current) {
        unregisterPending();
        isPendingRegisteredRef.current = false;
      }
      hasChangedRef.current = false;
      deleteItem(item.id);
      return;
    }

    setLocalQuantity(newQuantity);
    hasChangedRef.current = true;

    if (!isPendingRegisteredRef.current) {
      registerPending();
      isPendingRegisteredRef.current = true;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      updateItem(
        { itemId: item.id, quantity: newQuantity },
        {
          onSettled: () => {
            hasChangedRef.current = false;
            if (isPendingRegisteredRef.current) {
              unregisterPending();
              isPendingRegisteredRef.current = false;
            }
          },
        },
      );
      debounceTimeoutRef.current = null;
    }, 1000);
  };

  const handleIncrement = (): void => {
    handleQuantityChange(localQuantity + 1);
  };

  const handleDecrement = (): void => {
    handleQuantityChange(localQuantity - 1);
  };

  const isPending = isDeleting || isUpdating;

  return (
    <div
      className={`flex gap-4 rounded-xl p-3 ${isUnavailable ? "bg-[var(--background-200)]" : "bg-[var(--background-100)]"}`}
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
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--foreground-300)] text-xs">
            No Image
          </div>
        )}
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-[var(--accent-coral)] px-1.5 py-0.5 font-semibold text-[10px] text-white">
              UNAVAILABLE
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4
            className={`line-clamp-2 font-medium text-sm ${isUnavailable ? "text-[var(--foreground-300)] line-through" : "text-[var(--foreground-100)]"}`}
          >
            {item.product_name}
          </h4>
          {isUnavailable ? (
            <div className="mt-1">
              <span className="rounded-full bg-[var(--accent-coral-soft)] px-2 py-0.5 text-[var(--accent-coral)] text-xs">
                This item is no longer available
              </span>
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="font-bold font-display text-[var(--foreground-100)]">
                ₾{item.current_price.toFixed(2)}
              </span>
              <span className="text-[var(--foreground-300)] text-xs line-through">
                ₾{item.original_price.toFixed(2)}
              </span>
              <span className="rounded-full bg-[var(--accent-coral-soft)] px-1.5 py-0.5 font-semibold text-[var(--accent-coral)] text-xs">
                -{item.discount_percent}%
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {/* Quantity Controls */}
          {isUnavailable ? (
            <div className="flex items-center gap-1 rounded-full bg-[var(--background-300)] p-0.5 opacity-50">
              <div className="flex h-7 w-7 items-center justify-center">
                <Minus size={14} className="text-[var(--foreground-300)]" />
              </div>
              <span className="min-w-[1.5rem] text-center font-semibold text-[var(--foreground-300)] text-sm">
                {localQuantity}
              </span>
              <div className="flex h-7 w-7 items-center justify-center">
                <Plus size={14} className="text-[var(--foreground-300)]" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-[var(--background-200)] p-0.5">
              <Button
                onClick={handleDecrement}
                disabled={isPending}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--foreground-200)] transition-all hover:bg-white hover:text-[var(--foreground-100)] active:scale-95 disabled:opacity-50"
              >
                <Minus size={14} />
              </Button>
              <span className="min-w-[1.5rem] text-center font-semibold text-[var(--foreground-100)] text-sm">
                {localQuantity}
              </span>
              <Button
                onClick={handleIncrement}
                disabled={isPending}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--foreground-200)] transition-all hover:bg-white hover:text-[var(--foreground-100)] active:scale-95 disabled:opacity-50"
              >
                <Plus size={14} />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isUnavailable && (
              <span className="font-bold font-display text-[var(--foreground-100)]">
                ₾{item.subtotal.toFixed(2)}
              </span>
            )}
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full p-2 text-[var(--accent-coral)] transition-colors hover:bg-[var(--accent-coral-soft)] disabled:opacity-50"
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
