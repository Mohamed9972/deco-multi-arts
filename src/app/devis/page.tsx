import { getLang } from "@/lib/lang";
import { DevisForm } from "./devis-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Devis" };

export default async function DevisPage() {
  const lang = await getLang();
  return <DevisForm lang={lang} />;
}
