import type { Metadata } from "next";
import { Lato, Raleway } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/lib/cart-context";
import { I18nProvider } from "@/lib/i18n-context";

// Brand-guide typography: Raleway (display/headings) + Lato (body)
const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Viora Healthcare · Lab-Tested Research Peptides",
    template: "%s · Viora Healthcare",
  },
  description:
    "Premium research peptides, third-party verified, physician-backed, manufactured & packed in the United States. For research use only.",
  metadataBase: new URL("https://viorahealthcare.com"),
  openGraph: {
    title: "Viora Healthcare · Lab-Tested Research Peptides",
    description:
      "Premium research peptides, third-party verified, physician-backed, manufactured & packed in the United States.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${raleway.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <I18nProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget />
            <CartDrawer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
