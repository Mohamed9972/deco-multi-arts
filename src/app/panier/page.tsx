import { getLang } from "@/lib/lang";
import { PanierClient } from "./panier-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Panier" };

export default async function PanierPage() {
  const lang = await getLang();
  return <PanierClient lang={lang} />;
}
