import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";

import AppSidebar from "@/components/AppSidebar";
import { SessionProvider, ThemeProvider } from "@/components/Providers";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grim Wrapper",
  description:
    "Access a number of AI models including GPT-4, Gemini and Claude under a single platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={firaCode.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <main className="min-h-screen bg-gray-50">
              <SidebarProvider>
                <AppSidebar variant="inset" />
                <SidebarInset>{children}</SidebarInset>
              </SidebarProvider>
            </main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
