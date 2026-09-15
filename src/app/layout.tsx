import type { Metadata } from "next";
import { Fraunces, Outfit, Noto_Kufi_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-store";
import { getLang } from "@/lib/lang";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const arDisplay = Noto_Kufi_Arabic({
  variable: "--font-ar-display",
  subsets: ["arabic"],
  display: "swap",
});

const arBody = Noto_Naskh_Arabic({
  variable: "--font-ar-body",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Déco + Multi-Arts — Mobilier extérieur & créations sur mesure en Tunisie",
    template: "%s — Déco + Multi-Arts",
  },
  description:
    "Transats, salons de jardin, balançoires, pergolas et pots en résine pour villas, hôtels et piscines. Fabrication robuste, sur mesure, livraison en Tunisie. | أثاث خارجي في تونس.",
  metadataBase: new URL("https://deco-multi-arts.tn"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${display.variable} ${body.variable} ${arDisplay.variable} ${arBody.variable}`}
    >
      <body className="min-h-screen bg-ivory-50 text-charcoal-900 antialiased">
        <CartProvider>
          <Header lang={lang} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer lang={lang} />
        </CartProvider>
      </body>
    </html>
  );
}
