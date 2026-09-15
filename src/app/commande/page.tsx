import { getLang } from "@/lib/lang";
import { OrderForm } from "./order-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Commander" };

export default async function CommandePage() {
  const lang = await getLang();
  return <OrderForm lang={lang} />;
}
