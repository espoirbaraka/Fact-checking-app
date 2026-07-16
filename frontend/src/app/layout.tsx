import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/common/Providers";
import { APP_DESCRIPTION, APP_NAME } from "@/constants";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: [
      { url: "/logo-nord-kivu.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/logo-nord-kivu.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="h-full">
      <body
        className={`${sourceSans.variable} ${sourceSerif.variable} min-h-full font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
