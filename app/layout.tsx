import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karvon",
  verification: {
    yandex: "cf15debf5c7237ab",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
