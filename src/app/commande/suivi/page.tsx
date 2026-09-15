import { getLang } from "@/lib/lang";
import { TrackForm } from "./track-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Suivi de commande" };

export default async function SuiviPage() {
  const lang = await getLang();
  return <TrackForm lang={lang} />;
}
