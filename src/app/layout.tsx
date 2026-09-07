import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ToolHub",
    default: "ToolHub | All-in-one productivity platform",
  },
  description: "Unlock your workflow with 50+ specialized tools. Free, privacy-first, and lightning fast.",
  metadataBase: new URL("https://toolhub.example.com"),
  openGraph: {
    title: "ToolHub",
    description: "The modern, free, and privacy-first collection of productivity tools.",
    url: "https://toolhub.example.com",
    siteName: "ToolHub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolHub",
    description: "The modern, free, and privacy-first collection of productivity tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
