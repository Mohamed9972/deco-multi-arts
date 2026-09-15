// Données de repli (fallback) utilisées quand DATABASE_URL est absent
// (build Vercel sans DB, démo locale). La source de vérité reste Neon/Postgres.
// Photos : uniquement /public (photos réelles de l'entreprise).
// Données issues des publications Facebook Déco + Multi-Arts.
// Tél / WhatsApp : +216 93 343 187.

export type FallbackCategory = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  image: string;
  featured?: boolean;
};

export type FallbackProduct = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  shortDescription: string;
  shortDescriptionAr: string;
  description: string;
  descriptionAr: string;
  price: number | null;
  currency: string;
  productType: "DIRECT" | "ON_REQUEST" | "QUOTATION";
  available: boolean;
  featured: boolean;
  categorySlug: string;
  material?: string;
  dimensions?: Record<string, string>;
  colors?: string[];
  specifications?: string[];
  options?: { name: string; values: string[] }[];
  images: string[];
  coverImage: string;
};

export const PHONE_DISPLAY = "+216 93 343 187";
export const PHONE_WA = "21693343187";

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    id: "c-transats",
    name: "Transats & Chaises longues",
    nameAr: "ترانزات وكراسي الاستلقاء",
    slug: "chaises-longues",
    description: "Transats rotomoulés anti-UV pour piscines, plages et hôtels.",
    descriptionAr: "ترانزات بالقولبة الدورانية مقاومة للأشعة فوق البنفسجية للمسابح والشواطئ والفنادق.",
    image: "/transat-marina-1.jpg",
    featured: true,
  },
  {
    id: "c-salons",
    name: "Salons de jardin",
    nameAr: "صالونات الحديقة",
    slug: "salons-jardin",
    description: "Canapés, fauteuils et tables en métal galvanisé.",
    descriptionAr: "كنب وكراسي وطاولات من المعدن المجلفن.",
    image: "/salon-jardin-4.jpg",
    featured: true,
  },
  {
    id: "c-balancoires",
    name: "Balançoires",
    nameAr: "أرجوحات",
    slug: "balancoires",
    description: "Balançoires 3 places avec tente coulissante et coussins.",
    descriptionAr: "أرجوحات بثلاثة مقاعد مع مظلة منزلقة ووسائد.",
    image: "/balancoire-miami-1.jpg",
    featured: true,
  },
  {
    id: "c-pergolas",
    name: "Pergolas",
    nameAr: "برغولات",
    slug: "pergolas",
    description: "Pergolas démontables et structures sur mesure.",
    descriptionAr: "برغولات قابلة للفك وهياكل حسب الطلب.",
    image: "/pergola-1.jpg",
    featured: true,
  },
  {
    id: "c-daybeds",
    name: "Daybeds & Lits ronds",
    nameAr: "أسرّة خارجية",
    slug: "daybeds",
    description: "Daybeds et lit rond 2×2 m pour piscines et hôtels.",
    descriptionAr: "أسرّة خارجية وسرير دائري 2×2 م للمسابح والفنادق.",
    image: "/pergola-daybed-sur-mesure.jpg",
    featured: true,
  },
  {
    id: "c-pots",
    name: "Pots en résine",
    nameAr: "أحواض الريزين",
    slug: "pots-resine",
    description: "Pots 3D en résine : légers, résistants au soleil et à l'humidité.",
    descriptionAr: "أحواض ريزين بتصميم ثلاثي الأبعاد: خفيفة ومقاومة للشمس والرطوبة.",
    image: "/pots-resine-1.jpg",
    featured: true,
  },
];

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "p-marina",
    name: "Transat Marina",
    nameAr: "ترانزات مارينا",
    slug: "transat-marina",
    shortDescription: "Chaise longue rotomoulée anti-UV, intérieur & extérieur.",
    shortDescriptionAr: "كرسي استلقاء بالقولبة الدورانية مقاوم للأشعة فوق البنفسجية، للاستعمال الداخلي والخارجي.",
    description:
      "Le Transat Marina est notre best-seller pour piscines et hôtels. Fabriqué par rotomoulage en plastique anti-UV, il résiste aux chocs, aux intempéries et aux usages intensifs. Ligne sculpturale, assise confortable, entretien simple au jet d'eau. Disponible sur commande, toutes couleurs. Garantie 3 ans — peut rester dehors toute l'année.",
    descriptionAr:
      "ترانزات مارينا هو الأكثر مبيعاً للمسابح والفنادق. مصنوع بالقولبة الدورانية من البلاستيك المقاوم للأشعة فوق البنفسجية، يقاوم الصدمات والعوامل الجوية والاستعمال المكثف. خط أنيق، مقعد مريح، تنظيف سهل بالماء. متوفر عند الطلب بجميع الألوان. ضمان 3 سنوات — يمكن تركه في الخارج طوال السنة.",
    price: 850,
    currency: "TND",
    productType: "ON_REQUEST",
    available: true,
    featured: true,
    categorySlug: "chaises-longues",
    material: "Plastique anti-UV, fabrication par rotomoulage",
    dimensions: {
      Longueur: "200 cm",
      Largeur: "70 cm",
      Hauteur: "80 cm",
      "Hauteur d'assise": "17 cm",
      Poids: "20 kg",
    },
    colors: ["Blanc", "Sable", "Gris", "Bleu", "Terracotta"],
    specifications: [
      "Utilisation intérieure et extérieure",
      "Matière : plastique anti-UV",
      "Fabrication : rotomoulage",
      "Résistance aux chocs",
      "Résistance aux UV",
      "Résistance aux intempéries",
      "Garantie 3 ans",
      "Disponible sur commande",
    ],
    options: [{ name: "Couleur", values: ["Blanc", "Sable", "Gris", "Bleu", "Terracotta"] }],
    images: [
      "/transat-marina-1.jpg",
      "/transat-marina-2.jpg",
      "/transat-marina-3.jpg",
      "/transat-marina-4.jpg",
      "/transat-marina-5.jpg",
    ],
    coverImage: "/transat-marina-1.jpg",
  },
  {
    id: "p-salon-jardin",
    name: "Salon de jardin 4 pièces",
    nameAr: "صالون حديقة 4 قطع",
    slug: "salon-de-jardin",
    shortDescription: "Canapé 190/80, 2 fauteuils 80/80, table 110/60. Métal galvanisé.",
    shortDescriptionAr: "كنبة 190/80، كرسيان 80/80، طاولة 110/60. معدن مجلفن.",
    description:
      "Salon de jardin complet : canapé 190/80 cm, 2 fauteuils 80/80 cm et table 110/60 cm. Structure métallique galvanisée, tissu et mousse haute qualité. Livraison disponible. Prix sur demande par téléphone ou WhatsApp.",
    descriptionAr:
      "صالون حديقة كامل: كنبة 190/80 سم، كرسيان 80/80 سم وطاولة 110/60 سم. هيكل معدني مجلفن، قماش وإسفنج عالي الجودة. التوصيل متوفر. السعر عند الطلب عبر الهاتف أو واتساب.",
    price: null,
    currency: "TND",
    productType: "ON_REQUEST",
    available: true,
    featured: true,
    categorySlug: "salons-jardin",
    material: "Structure métallique galvanisée, tissu et mousse haute qualité",
    dimensions: {
      Canapé: "190/80 cm",
      Fauteuils: "2 × 80/80 cm",
      Table: "110/60 cm",
    },
    specifications: [
      "1 canapé + 2 fauteuils + 1 table",
      "Structure métallique galvanisée",
      "Tissu et mousse haute qualité",
      "Livraison disponible",
    ],
    images: ["/salon-jardin-1.jpg", "/salon-jardin-3.jpg", "/salon-jardin-4.jpg"],
    coverImage: "/salon-jardin-4.jpg",
  },
  {
    id: "p-balancoire-miami",
    name: "Balançoire Miami 3 places",
    nameAr: "أرجوحة ميامي 3 مقاعد",
    slug: "balancoire-miami",
    shortDescription: "Tente coulissante, coussins inclus, structure acier.",
    shortDescriptionAr: "مظلة منزلقة، وسائد مشمولة، هيكل فولاذي.",
    description:
      "Balançoire Miami 3 places avec tente coulissante et coussins. Structure acier gris et gris clair, design moderne pour jardin, piscine, terrasse et plage. Disponible sur commande.",
    descriptionAr:
      "أرجوحة ميامي بثلاثة مقاعد مع مظلة منزلقة ووسائد مريحة. هيكل فولاذي رمادي بتصميم عصري للحديقة والمسبح والشرفة والشاطئ. متوفرة عند الطلب.",
    price: null,
    currency: "TND",
    productType: "ON_REQUEST",
    available: true,
    featured: true,
    categorySlug: "balancoires",
    material: "Acier, toile et coussins outdoor",
    dimensions: { Places: "3", Toit: "tente coulissante" },
    colors: ["Gris", "Gris clair"],
    specifications: [
      "3 places avec coussins",
      "Tente coulissante",
      "Structure acier",
      "Jardin, piscine, terrasse, plage",
    ],
    images: [
      "/balancoire-miami-1.jpg",
      "/balancoire-miami-2.jpg",
      "/balancoire-miami-3.jpg",
      "/balancoire-miami-4.jpg",
    ],
    coverImage: "/balancoire-miami-1.jpg",
  },
  {
    id: "p-pergola",
    name: "Pergola sur mesure",
    nameAr: "برغولا حسب الطلب",
    slug: "pergola-sur-mesure",
    shortDescription: "Pergola démontable aux dimensions exactes de votre espace.",
    shortDescriptionAr: "برغولا قابلة للفك بالمقاسات الدقيقة لمساحتك.",
    description:
      "Pergolas démontables et designs modernes pour jardin, piscine, terrasse et plage. Villas, hôtels, restaurants : nous concevons aux dimensions exactes de votre lieu. Envoyez plans, photos et dimensions pour un devis gratuit.",
    descriptionAr:
      "برغولات قابلة للفك وتصاميم عصرية للحديقة والمسبح والشرفة والشاطئ. فلل وفنادق ومطاعم: نصمم حسب المقاسات الدقيقة لمكانك. أرسل المخططات والصور والمقاسات للحصول على عرض سعر مجاني.",
    price: null,
    currency: "TND",
    productType: "QUOTATION",
    available: true,
    featured: true,
    categorySlug: "pergolas",
    material: "Structure robuste, finition outdoor",
    dimensions: { "Sur mesure": "selon plans" },
    specifications: [
      "Fabrication sur mesure",
      "Pergolas démontables",
      "Villas, hôtels, restaurants",
      "Devis gratuit sur plans",
    ],
    images: ["/pergola-1.jpg", "/pergola-2.jpg"],
    coverImage: "/pergola-1.jpg",
  },
  {
    id: "p-lit-rond",
    name: "Lit rond royal 2×2 m",
    nameAr: "السرير الدائري الملكي 2×2 م",
    slug: "lit-rond-royal",
    shortDescription: "Aluminium anti-rouille, tissu waterproof, 2×2 m.",
    shortDescriptionAr: "ألمنيوم مقاوم للصدأ، قماش مضاد للماء، 2×2 م.",
    description:
      "Transformez votre extérieur en havre de paix avec le lit rond royal : 2 mètres sur 2 mètres de détente absolue au bord de la piscine. Structure aluminium haute qualité résistante à la rouille et aux intempéries, tissu luxueux waterproof facile à nettoyer. Devis sur demande.",
    descriptionAr:
      "حوّل جلستك الخارجية إلى واحة من الجمال مع سريرنا الدائري الملكي 2×2 م: راحة مطلقة بجانب المسبح. هيكل قوي من الألمنيوم عالي الجودة المقاوم للصدأ والعوامل الجوية، قماش فاخر مضاد للماء وسهل التنظيف. عرض السعر عند الطلب.",
    price: null,
    currency: "TND",
    productType: "QUOTATION",
    available: true,
    featured: true,
    categorySlug: "daybeds",
    material: "Aluminium haute qualité, tissu waterproof",
    dimensions: { Longueur: "200 cm", Largeur: "200 cm" },
    specifications: [
      "Structure aluminium anti-rouille",
      "Tissu waterproof facile à nettoyer",
      "Résiste à l'humidité piscine et pluie",
      "Idéal piscines et hôtels",
    ],
    images: ["/pergola-daybed-sur-mesure.jpg", "/pergola-2.jpg"],
    coverImage: "/pergola-daybed-sur-mesure.jpg",
  },
  {
    id: "p-pot-petit",
    name: "Pot résine 3D — Petit",
    nameAr: "حوض ريزين ثلاثي الأبعاد — صغير",
    slug: "pot-resine-petit",
    shortDescription: "35×35×62 cm, 400 DT. Léger, résistant soleil et humidité.",
    shortDescriptionAr: "35×35×62 سم، 400 د.ت. خفيف ومقاوم للشمس والرطوبة.",
    description:
      "Auge à plantes moderne en résine luxueuse au design géométrique 3D. Haute résistance : supporte soleil, chaleur et humidité sans changement de couleur ni fissures. Légère et robuste, facile à déplacer. Petit modèle 35/35/62 cm.",
    descriptionAr:
      "حوض نباتات عصري من الريزين الفاخر بتصميم هندسي ثلاثي الأبعاد. مقاومة عالية: يتحمل الشمس والحرارة والرطوبة دون تغير في اللون أو تشقق. خفيف ومتين وسهل النقل. المقاس الصغير 35/35/62 سم.",
    price: 400,
    currency: "TND",
    productType: "DIRECT",
    available: true,
    featured: false,
    categorySlug: "pots-resine",
    material: "Résine luxueuse, effet 3D",
    dimensions: { Longueur: "35 cm", Largeur: "35 cm", Hauteur: "62 cm" },
    colors: ["Blanc", "Bleu clair", "Plusieurs coloris"],
    specifications: [
      "Résiste au soleil et à la chaleur",
      "Résiste à l'humidité",
      "Léger et facile à déplacer",
      "Design 3D royal",
    ],
    images: ["/pots-resine-1.jpg", "/pots-resine-2.jpg", "/pots-resine-4.jpg"],
    coverImage: "/pots-resine-1.jpg",
  },
  {
    id: "p-pot-grand",
    name: "Pot résine 3D — Grand",
    nameAr: "حوض ريزين ثلاثي الأبعاد — كبير",
    slug: "pot-resine-grand",
    shortDescription: "97×62×35 cm, 500 DT. Plusieurs coloris.",
    shortDescriptionAr: "97×62×35 سم، 500 د.ت. بعدة ألوان.",
    description:
      "Le grand modèle d'auge résine 3D : 97 cm de long pour structurer jardins, terrasses et entrées d'hôtel. Mêmes qualités — résistance soleil et humidité, légèreté, touche 3D royale — en plusieurs coloris. Quantité limitée.",
    descriptionAr:
      "المقاس الكبير من حوض الريزين ثلاثي الأبعاد: طول 97 سم لتنسيق الحدائق والشرفات ومداخل الفنادق. نفس المزايا — مقاومة الشمس والرطوبة، خفة الوزن، لمسة ملكية — وبعدة ألوان. الكمية محدودة.",
    price: 500,
    currency: "TND",
    productType: "DIRECT",
    available: true,
    featured: true,
    categorySlug: "pots-resine",
    material: "Résine luxueuse, effet 3D",
    dimensions: { Longueur: "97 cm", Largeur: "62 cm", Hauteur: "35 cm" },
    colors: ["Blanc", "Bleu clair", "Plusieurs coloris"],
    specifications: [
      "Résiste au soleil et à la chaleur",
      "Résiste à l'humidité",
      "Léger et facile à déplacer",
      "Design 3D royal",
    ],
    images: ["/pots-resine-3.jpg", "/pots-resine-5.jpg", "/pots-resine-6.jpg", "/pots-resine-7.jpg"],
    coverImage: "/pots-resine-3.jpg",
  },
];

export const GALLERY = [
  "/salon-jardin-2.jpg",
  "/pergola-2.jpg",
  "/pots-resine-6.jpg",
  "/salon-jardin-3.jpg",
  "/transat-marina-2.jpg",
  "/balancoire-miami-2.jpg",
];

export const HERO_IMAGE = "/hero-piscine.jpg";
export const LOGO_IMAGE = "/logo.jpg";
