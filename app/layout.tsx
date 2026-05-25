import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartButton from "@/components/CartButton";
import Script from 'next/script';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Software MP | Premium Software Marketplace",
  description: "Browse, test, and buy premium high-quality software, tools, and developer licenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#F5EBE0] text-[#2b2522] min-h-screen selection:bg-[#D5BDAF] selection:text-[#2b2522]`}
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3VSW492G8Z" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3VSW492G8Z');
          `}
        </Script>
        
        <CartProvider>
          <CartButton />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
