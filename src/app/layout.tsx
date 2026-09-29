import type { Metadata, Viewport } from "next";
import MobileTabBar from "@/components/MobileTabBar";
import RouterBridge from "@/components/RouterBridge";
import "./fonts.css";
import "./globals.css";
import "./responsive.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "Simbatech",
  description: "Everything you need, to own or to rent — delivered to your door.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D4F8B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <RouterBridge />
        {children}
        <MobileTabBar />
      </body>
    </html>
  );
}
