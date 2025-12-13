import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import agrohubLogo from "../../../public/images/agrohub.png";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import magnitiLogo from "../../../public/images/magniti.avif";
import nikoraLogo from "../../../public/images/nikora.png";
import sparLogo from "../../../public/images/spar.jpeg";
import { Button } from "../button";

interface Store {
  id: string;
  name: string;
  logo: StaticImageData;
}

// Sample stores
const stores: Store[] = [
  {
    id: "1",
    name: "Agrohub",
    logo: agrohubLogo,
  },
  {
    id: "2",
    name: "Europroduct",
    logo: europroductLogo,
  },
  {
    id: "3",
    name: "Goodwill",
    logo: goodwillLogo,
  },
  {
    id: "4",
    name: "Magniti",
    logo: magnitiLogo,
  },
  {
    id: "5",
    name: "Nikora",
    logo: nikoraLogo,
  },
  {
    id: "6",
    name: "Spar",
    logo: sparLogo,
  },
];

export function FilterBar() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  return (
    <div
      className="sticky top-0 z-10 border-b-2 p-4"
      style={{
        backgroundColor: "var(--color-yellow)",
        borderColor: "var(--color-dark-green)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <h2
          className="mb-3 font-semibold text-lg"
          style={{ color: "var(--color-dark-green)" }}
        >
          Filter by Store
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {/* All Stores Button */}
          <Button
            onClick={() => setSelectedStore(null)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm outline-none transition-all focus:outline-none ${
              selectedStore === null ? "" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor:
                selectedStore === null
                  ? "var(--color-dark-green)"
                  : "var(--color-cream)",
              color:
                selectedStore === null
                  ? "var(--color-cream)"
                  : "var(--color-dark-green)",
            }}
          >
            All Stores
          </Button>

          {/* Store Filter Buttons */}
          {stores.map((store) => (
            <Button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 outline-none transition-all focus:outline-none ${
                selectedStore === store.id ? "" : "opacity-70 hover:opacity-100"
              }`}
              style={{
                backgroundColor:
                  selectedStore === store.id
                    ? "var(--color-dark-green)"
                    : "var(--color-cream)",
                color:
                  selectedStore === store.id
                    ? "var(--color-cream)"
                    : "var(--color-dark-green)",
              }}
            >
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-white p-0.5">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <span className="whitespace-nowrap font-medium text-sm">
                {store.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
