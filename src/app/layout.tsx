import type { Metadata } from "next";
import Providers from "@/components/providers/Providers";
import AIChatWidget from "@/components/chat/AIChatWidget";
import TawkToWidget from "@/components/chat/TawkToWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "EulerX Network — AI-Powered Automated Trading",
  description:
    "Non-custodial AI-driven automated trading infrastructure. Connect your wallet and let AI manage your strategies.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <Providers>
          {children}
          <AIChatWidget />
          <TawkToWidget />
        </Providers>
      </body>
    </html>
  );
}
