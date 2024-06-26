import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/storeProvider";
import QueryProvider from "@/utils/queryProvider";
import MainContainer from "@/components/mainContainer/mainContainer";
import RouteChangeListener from "@/utils/routeChangeListener";
import { Suspense } from "react";
import MapLoader from "@/components/loaders/mapLoader";
import Loader from "@/components/loader/loader";
import WelcomePopup from "@/components/welcomePopup/welcomePopup";

export const metadata: Metadata = {
  title: "Guinness map",
  description: "Rate and record prices of Guinnesses, big dog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <main style={{ position: "relative" }} id="main">
            <Suspense fallback={<MapLoader />}>
              <MainContainer />
            </Suspense>
            <RouteChangeListener />
            <WelcomePopup />
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
