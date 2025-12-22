import { Suspense } from "react";
import { Products } from "@/components/products";

export default async function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100svh] items-center justify-center bg-[var(--color-cream)] md:h-screen">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-sage)] border-t-[var(--color-yellow)]" />
        </div>
      }
    >
      <Products />
    </Suspense>
  );
}
