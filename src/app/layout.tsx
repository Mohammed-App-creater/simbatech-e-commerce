import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import MobileTabBar from "@/components/MobileTabBar";
import NavProgress from "@/components/NavProgress";
import RouterBridge from "@/components/RouterBridge";
import StoreProvider from "@/components/StoreProvider";
import { getStore } from "@/lib/server/api";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const store = await getStore().catch(() => null);
  return (
    <html lang="en">
      <body>
        <StoreProvider store={store}>
          <RouterBridge />
          <Suspense fallback={null}>
            <NavProgress />
          </Suspense>
          {children}
          <MobileTabBar />
        </StoreProvider>
      </body>
    </html>
  );
}
