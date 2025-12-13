"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import agrohubLogo from "../../../public/images/agrohub.png";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import sparLogo from "../../../public/images/spar.jpeg";
import { FilterBar } from "../filter-bar";

// Types

interface Product {
  id: string;
  name: string;
  image: string;
  storeId: string;
  storeLogo: StaticImageData;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  daysLeft?: number;
}

// Sample products
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    storeId: "1",
    storeLogo: agrohubLogo,
    originalPrice: 349.99,
    salePrice: 249.99,
    discountPercentage: 29,
    daysLeft: 3,
  },
  {
    id: "2",
    name: "Smart Watch Series 8",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    storeId: "2",
    storeLogo: europroductLogo,
    originalPrice: 399.99,
    salePrice: 299.99,
    discountPercentage: 25,
    daysLeft: 5,
  },
  {
    id: "3",
    name: "Professional Camera DSLR",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    storeId: "3",
    storeLogo: goodwillLogo,
    originalPrice: 1299.99,
    salePrice: 899.99,
    discountPercentage: 31,
    daysLeft: 7,
  },
  {
    id: "4",
    name: "Mechanical Gaming Keyboard RGB",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
    storeId: "4",
    storeLogo: magnitiLogo,
    originalPrice: 179.99,
    salePrice: 119.99,
    discountPercentage: 33,
    daysLeft: 2,
  },
  {
    id: "5",
    name: "Premium Leather Backpack",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    storeId: "5",
    storeLogo: nikoraLogo,
    originalPrice: 159.99,
    salePrice: 99.99,
    discountPercentage: 38,
    daysLeft: 4,
  },
  {
    id: "6",
    name: "Running Shoes Athletic",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    storeId: "6",
    storeLogo: sparLogo,
    originalPrice: 129.99,
    salePrice: 79.99,
    discountPercentage: 38,
    daysLeft: 6,
  },
  {
    id: "7",
    name: "Portable Bluetooth Speaker",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    storeId: "1",
    storeLogo: agrohubLogo,
    originalPrice: 99.99,
    salePrice: 59.99,
    discountPercentage: 40,
    daysLeft: 3,
  },
  {
    id: "8",
    name: "Laptop Stand Aluminum",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    storeId: "2",
    storeLogo: europroductLogo,
    originalPrice: 79.99,
    salePrice: 49.99,
    discountPercentage: 38,
    daysLeft: 5,
  },
  {
    id: "9",
    name: "Espresso Coffee Machine",
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    storeId: "3",
    storeLogo: goodwillLogo,
    originalPrice: 599.99,
    salePrice: 399.99,
    discountPercentage: 33,
    daysLeft: 8,
  },
  {
    id: "10",
    name: "Wireless Gaming Mouse",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
    storeId: "4",
    storeLogo: magnitiLogo,
    originalPrice: 89.99,
    salePrice: 59.99,
    discountPercentage: 33,
    daysLeft: 4,
  },
  {
    id: "11",
    name: "Fitness Tracker Band",
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
    storeId: "5",
    storeLogo: nikoraLogo,
    originalPrice: 149.99,
    salePrice: 99.99,
    discountPercentage: 33,
    daysLeft: 6,
  },
  {
    id: "12",
    name: "Portable Power Bank 20000mAh",
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
    storeId: "6",
    storeLogo: sparLogo,
    originalPrice: 59.99,
    salePrice: 39.99,
    discountPercentage: 33,
    daysLeft: 2,
  },
];

export function Products() {
  const [selectedStore, _setSelectedStore] = useState<string | null>(null);

  const filteredProducts = selectedStore
    ? products.filter((product) => product.storeId === selectedStore)
    : products;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <FilterBar />

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-4 text-[var(--color-dark-green)] text-sm">
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-lg bg-[var(--color-sage)] shadow-md transition-shadow hover:shadow-xl">
      {/* Product Image with Store Badge */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        {/* Store Logo Badge */}
        <div className="absolute top-2 right-2 h-10 w-10 overflow-hidden rounded-full bg-white shadow-lg ring-2 ring-[var(--color-dark-green)]">
          <Image
            src={product.storeLogo}
            alt="Store"
            fill
            className="rounded-full object-contain p-1"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-[var(--color-dark-green)] text-base">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-bold text-2xl text-[var(--color-orange)]">
            ${product.salePrice.toFixed(2)}
          </span>
          <span className="text-[var(--color-dark-green)] text-sm line-through opacity-60">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--color-orange)] px-3 py-1 font-bold text-white text-xs">
            {product.discountPercentage}% OFF
          </span>

          {product.daysLeft && (
            <span className="font-medium text-[var(--color-dark-green)] text-xs">
              {product.daysLeft} days left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
