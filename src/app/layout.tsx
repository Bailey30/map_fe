import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/storeProvider";
import QueryProvider from "@/utils/queryProvider";
import MainContainer from "@/components/mainContainer/mainContainer";


export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body >
                <QueryProvider>
                    <StoreProvider>
                        <main style={{ "position": "relative" }}>
                            <MainContainer />
                            {children}
                        </main>
                    </StoreProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
