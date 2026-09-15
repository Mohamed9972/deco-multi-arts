// Helpers : formatage TND, statuts FR, numéros de commande, WhatsApp.
// i18n : tout le FR passe par ces dictionnaires pour faciliter ar/en plus tard.

export const ORDER_STATUS_FR: Record<string, string> = {
  PENDING: "Nouvelle",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const QUOTE_STATUS_FR: Record<string, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Contacté",
  IN_PROGRESS: "En cours",
  SENT: "Devis envoyé",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
};

export const PROJECT_TYPE_FR: Record<string, string> = {
  VILLA: "Villa",
  HOTEL: "Hôtel",
  PISCINE: "Piscine",
  TERRASSE: "Terrasse",
  JARDIN: "Jardin",
  RESTAURANT: "Restaurant",
  RESIDENCE: "Résidence",
  PROFESSIONNEL: "Projet professionnel",
  AUTRE: "Autre",
};

export const PRODUCT_TYPE_FR: Record<string, string> = {
  DIRECT: "Achat direct",
  ON_REQUEST: "Sur commande",
  QUOTATION: "Sur devis",
};

export const PRODUCT_TYPE_AR: Record<string, string> = {
  DIRECT: "شراء مباشر",
  ON_REQUEST: "عند الطلب",
  QUOTATION: "حسب الطلب",
};

export const PROJECT_TYPE_AR: Record<string, string> = {
  VILLA: "فيلا",
  HOTEL: "فندق",
  PISCINE: "مسبح",
  TERRASSE: "شرفة",
  JARDIN: "حديقة",
  RESTAURANT: "مطعم",
  RESIDENCE: "إقامة",
  PROFESSIONNEL: "مشروع مهني",
  AUTRE: "أخرى",
};

export const ORDER_STATUS_AR: Record<string, string> = {
  PENDING: "جديدة",
  CONFIRMED: "مؤكدة",
  PROCESSING: "قيد التحضير",
  READY: "جاهزة",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغاة",
};

export type Lang = "fr" | "ar";

export const LANG_COOKIE = "dma_lang";

export function productTypeLabel(type: string, lang: Lang = "fr"): string {
  const dict = lang === "ar" ? PRODUCT_TYPE_AR : PRODUCT_TYPE_FR;
  return dict[type] ?? type;
}

export function projectTypeLabel(type: string, lang: Lang = "fr"): string {
  const dict = lang === "ar" ? PROJECT_TYPE_AR : PROJECT_TYPE_FR;
  return dict[type] ?? type;
}

export function orderStatusLabel(status: string, lang: Lang = "fr"): string {
  const dict = lang === "ar" ? ORDER_STATUS_AR : ORDER_STATUS_FR;
  return dict[status] ?? status;
}

export const ORDER_STEPS = [
  { key: "PENDING", label: "Commande reçue" },
  { key: "CONFIRMED", label: "Commande confirmée" },
  { key: "PROCESSING", label: "En préparation" },
  { key: "READY", label: "Prête" },
  { key: "DELIVERED", label: "Livrée" },
] as const;

export const ORDER_STEPS_AR = [
  { key: "PENDING", label: "تم استلام الطلب" },
  { key: "CONFIRMED", label: "تم تأكيد الطلب" },
  { key: "PROCESSING", label: "قيد التحضير" },
  { key: "READY", label: "جاهز" },
  { key: "DELIVERED", label: "تم التوصيل" },
] as const;

export function orderSteps(lang: Lang = "fr") {
  return lang === "ar" ? ORDER_STEPS_AR : ORDER_STEPS;
}

export function formatTND(value: number | string | null | undefined, lang: Lang = "fr"): string {
  if (value === null || value === undefined || value === "")
    return lang === "ar" ? "حسب الطلب" : "Sur devis";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return lang === "ar" ? "حسب الطلب" : "Sur devis";
  // Format tunisien : 1 250,000 DT
  return (
    n.toLocaleString("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }) + " DT"
  );
}

export function formatDateFR(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-TN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function nextOrderNumber(last?: string): string {
  const year = new Date().getFullYear();
  let seq = 1;
  if (last) {
    const m = last.match(/CMD-(\d+)-(\d+)/);
    if (m && parseInt(m[1]) === year) seq = parseInt(m[2]) + 1;
  }
  return `CMD-${year}-${String(seq).padStart(4, "0")}`;
}

export function nextQuoteNumber(last?: string): string {
  const year = new Date().getFullYear();
  let seq = 1;
  if (last) {
    const m = last.match(/DEV-(\d+)-(\d+)/);
    if (m && parseInt(m[1]) === year) seq = parseInt(m[2]) + 1;
  }
  return `DEV-${year}-${String(seq).padStart(4, "0")}`;
}

export function normalizeTnPhone(phone: string): string {
  return phone.replace(/[\s.-]/g, "");
}

export function isValidTnPhone(phone: string): boolean {
  const p = normalizeTnPhone(phone);
  return /^(\+216)?[24579]\d{7}$/.test(p);
}

export function whatsappLink(message: string, orderNumber?: string): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "21600000000";
  const text = orderNumber
    ? `Bonjour Déco + Multi-Arts, je vous contacte au sujet de ${orderNumber}. ${message}`
    : `Bonjour Déco + Multi-Arts, ${message}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
