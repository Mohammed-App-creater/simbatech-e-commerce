import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import "./responsive.css";

export const metadata: Metadata = {
  title: "Simbatech",
  description: "Everything you need, to own or to rent — delivered to your door.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
