import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Optimized Google Fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rknrbmhzejzgdkgcestf.supabase.co'), // Replace with your actual domain later
  title: {
    default: "Sauce Burst - Burgers, Pizzas & Drinks",
    template: "%s - Sauce Burst"
  },
  description: "Delicious flame-grilled burgers, authentic wood-fired pizzas, and refreshing drinks waiting just for you.",
  keywords: ["burgers", "pizzas", "fast food", "restaurant", "Sauce Burst"],
  openGraph: {
    title: "Sauce Burst",
    description: "Delicious flame-grilled burgers, pizzas, and drinks delivered fast!",
    url: 'https://your-domain.com',
    siteName: 'Sauce Burst',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg', // You will need to add this image to your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sauce Burst',
    description: 'Delicious flame-grilled burgers and pizzas.',
    images: ['https://your-domain.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-full flex flex-col`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}