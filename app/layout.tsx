import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Instrument_Sans, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const robotoSlabHeading = Roboto_Slab({subsets:['latin'],variable:'--font-heading'});

const instrumentSans = Instrument_Sans({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spese",
  description: "Track expenses, budgets, and income.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        instrumentSans.variable,
        robotoSlabHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
