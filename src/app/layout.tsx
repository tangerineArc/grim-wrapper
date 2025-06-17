import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";

import { SessionProvider, ThemeProvider } from "@/components/Providers";

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
            <main className="min-h-screen bg-gray-50">{children}</main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
