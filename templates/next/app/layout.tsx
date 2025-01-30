import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SideNav from "@/components/layout/SideNav";
import { ChatProvider } from "@/components/chat/SolanaAgentProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solana Agent Terminal",
  description: "Solana Agent Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ChatProvider>
            <div className="fixed inset-0 bg-background flex">
              <SideNav />
              <main className="flex-1 relative overflow-y-auto scrollbar-none scroll-smooth">
                <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
            </div>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
