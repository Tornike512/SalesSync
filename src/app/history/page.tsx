import type { Metadata } from "next";
import { History } from "@/components/history";

export const metadata: Metadata = {
  title: "History - SaleSync",
  description: "View your product viewing history",
};

export default function HistoryPage() {
  return <History />;
}
