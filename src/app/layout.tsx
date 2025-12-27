"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./style.scss";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import ModalProvider from "@/providers/modal-provider";
import "react-loading-skeleton/dist/skeleton.css";
import DialogflowMessenger from "@/components/dialogMessage";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="vi">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>

      <body className={inter.className}>
        <Toaster />
        {!isAdminPage && <Navbar />}
        <ModalProvider />
        {children}
        {!isAdminPage && (
          <>
            <div className="p-3 bg-[#f4f4f4]" />
            <DialogflowMessenger />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
