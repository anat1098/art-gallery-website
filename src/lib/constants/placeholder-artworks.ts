import type { ArtworkCardData, ArtworkDetailData } from "@/types/artwork";

/**
 * Placeholder catalog data, shaped like the future `Artwork` query results.
 * Replace with real Prisma queries (`prisma.artwork.findMany` /
 * `prisma.artwork.findUnique`) once the database is seeded via the admin
 * dashboard.
 */
export const allArtworks: ArtworkDetailData[] = [
  {
    id: "print-1",
    type: "PRINT",
    slug: "quiet-horizon",
    title: "Quiet Horizon",
    titleHe: "אופק שקט",
    medium: "Oil",
    mediumHe: "שמן",
    categoryName: "Landscape",
    categoryNameHe: "נוף",
    price: 145,
    imageUrl: "",
    imageAlt: "Quiet Horizon print",
    description:
      "A study of stillness — layered horizons in muted ochre and slate, printed on archival cotton rag paper.",
    descriptionHe:
      "מחקר של שלווה — אופקים שכובים בגוני אוכרה ואפור עמום, מודפס על נייר כותנה ארכיוני.",
    materials: "Archival cotton rag paper, pigment ink",
    estimatedDelivery: "5–9 business days",
    images: [
      { id: "p1-1", seed: "print-1-main", alt: "Quiet Horizon, full view", kind: "main" },
      { id: "p1-2", seed: "print-1-detail", alt: "Quiet Horizon, detail", kind: "detail" },
      { id: "p1-3", seed: "print-1-framed", alt: "Quiet Horizon, framed", kind: "framed" },
    ],
    printSizes: [
      { id: "p1-a4", label: "A4 (21×30cm)", widthCm: 21, heightCm: 30, price: 145, inventory: 15 },
      { id: "p1-a3", label: "A3 (30×42cm)", widthCm: 30, heightCm: 42, price: 195, inventory: 8 },
      { id: "p1-a2", label: "A2 (42×60cm)", widthCm: 42, heightCm: 60, price: 265, inventory: 3 },
    ],
    frameOptions: [
      { id: "p1-none", label: "No Frame", priceDelta: 0, isDefault: true },
      { id: "p1-oak", label: "Oak Frame", priceDelta: 85 },
      { id: "p1-black", label: "Black Frame", priceDelta: 85 },
    ],
  },
  {
    id: "print-2",
    type: "PRINT",
    slug: "amber-fields",
    title: "Amber Fields",
    titleHe: "שדות ענבר",
    medium: "Acrylic",
    mediumHe: "אקריליק",
    categoryName: "Landscape",
    categoryNameHe: "נוף",
    price: 165,
    imageUrl: "",
    imageAlt: "Amber Fields print",
    description:
      "Warm, sun-bleached fields rendered in loose acrylic strokes, printed with rich, saturated color.",
    descriptionHe:
      "שדות חמים ומוכי שמש המצוירים במשיכות אקריליק חופשיות, מודפסים בצבע עשיר ורווי.",
    materials: "Archival cotton rag paper, pigment ink",
    estimatedDelivery: "5–9 business days",
    images: [
      { id: "p2-1", seed: "print-2-main", alt: "Amber Fields, full view", kind: "main" },
      { id: "p2-2", seed: "print-2-detail", alt: "Amber Fields, detail", kind: "detail" },
    ],
    printSizes: [
      { id: "p2-a4", label: "A4 (21×30cm)", widthCm: 21, heightCm: 30, price: 165, inventory: 12 },
      { id: "p2-a3", label: "A3 (30×42cm)", widthCm: 30, heightCm: 42, price: 215, inventory: 6 },
    ],
    frameOptions: [
      { id: "p2-none", label: "No Frame", priceDelta: 0, isDefault: true },
      { id: "p2-oak", label: "Oak Frame", priceDelta: 85 },
    ],
  },
  {
    id: "print-3",
    type: "PRINT",
    slug: "morning-study",
    title: "Morning Study",
    titleHe: "מחקר בוקר",
    medium: "Pencil",
    mediumHe: "עיפרון",
    categoryName: "Still Life",
    categoryNameHe: "טבע דומם",
    price: 95,
    imageUrl: "",
    imageAlt: "Morning Study print",
    description:
      "A quiet pencil study of morning light across a windowsill, reproduced in soft, precise detail.",
    descriptionHe:
      "מחקר עיפרון שקט של אור בוקר על אדן חלון, משוחזר בפירוט עדין ומדויק.",
    materials: "Archival cotton rag paper, pigment ink",
    estimatedDelivery: "5–9 business days",
    images: [
      { id: "p3-1", seed: "print-3-main", alt: "Morning Study, full view", kind: "main" },
      { id: "p3-2", seed: "print-3-angle", alt: "Morning Study, angle view", kind: "angle" },
    ],
    printSizes: [
      { id: "p3-a4", label: "A4 (21×30cm)", widthCm: 21, heightCm: 30, price: 95, inventory: 20 },
      { id: "p3-a3", label: "A3 (30×42cm)", widthCm: 30, heightCm: 42, price: 135, inventory: 10 },
    ],
    frameOptions: [
      { id: "p3-none", label: "No Frame", priceDelta: 0, isDefault: true },
      { id: "p3-black", label: "Black Frame", priceDelta: 75 },
    ],
  },
  {
    id: "print-4",
    type: "PRINT",
    slug: "still-water",
    title: "Still Water",
    titleHe: "מים דוממים",
    medium: "Charcoal",
    mediumHe: "פחם",
    categoryName: "Landscape",
    categoryNameHe: "נוף",
    price: 120,
    imageUrl: "",
    imageAlt: "Still Water print",
    description:
      "A charcoal meditation on calm water, rich in tonal depth and soft, atmospheric gradients.",
    descriptionHe:
      "הרהור בפחם על מים רגועים, עשיר בעומק גוני ובמעברים אטמוספריים רכים.",
    materials: "Archival cotton rag paper, pigment ink",
    estimatedDelivery: "5–9 business days",
    images: [
      { id: "p4-1", seed: "print-4-main", alt: "Still Water, full view", kind: "main" },
      { id: "p4-2", seed: "print-4-lifestyle", alt: "Still Water, in a room", kind: "lifestyle" },
    ],
    printSizes: [
      { id: "p4-a4", label: "A4 (21×30cm)", widthCm: 21, heightCm: 30, price: 120, inventory: 18 },
      { id: "p4-a3", label: "A3 (30×42cm)", widthCm: 30, heightCm: 42, price: 165, inventory: 5 },
      { id: "p4-a2", label: "A2 (42×60cm)", widthCm: 42, heightCm: 60, price: 225, inventory: 2 },
    ],
    frameOptions: [
      { id: "p4-none", label: "No Frame", priceDelta: 0, isDefault: true },
      { id: "p4-oak", label: "Oak Frame", priceDelta: 85 },
      { id: "p4-black", label: "Black Frame", priceDelta: 85 },
    ],
  },
  {
    id: "original-1",
    type: "ORIGINAL",
    slug: "the-long-afternoon",
    title: "The Long Afternoon",
    titleHe: "אחר הצהריים הארוך",
    medium: "Oil on canvas",
    mediumHe: "שמן על בד",
    categoryName: "Landscape",
    categoryNameHe: "נוף",
    price: 3200,
    imageUrl: "",
    imageAlt: "The Long Afternoon original painting",
    description:
      "A large, slow-built oil painting exploring the quality of light in late afternoon — the original, one-of-a-kind piece.",
    descriptionHe:
      "ציור שמן גדול שנבנה לאט, החוקר את איכות האור בשעות אחר הצהריים המאוחרות — היצירה המקורית והייחודית.",
    materials: "Oil on stretched canvas",
    widthCm: 90,
    heightCm: 120,
    yearCreated: 2025,
    shippingTimeNote: "Ships in a custom crate within 10–14 business days",
    images: [
      { id: "o1-1", seed: "original-1-main", alt: "The Long Afternoon, full view", kind: "main" },
      { id: "o1-2", seed: "original-1-detail", alt: "The Long Afternoon, detail", kind: "detail" },
      { id: "o1-3", seed: "original-1-lifestyle", alt: "The Long Afternoon, in a room", kind: "lifestyle" },
    ],
  },
  {
    id: "original-2",
    type: "ORIGINAL",
    slug: "between-seasons",
    title: "Between Seasons",
    titleHe: "בין העונות",
    medium: "Acrylic on canvas",
    mediumHe: "אקריליק על בד",
    categoryName: "Landscape",
    categoryNameHe: "נוף",
    price: 2400,
    imageUrl: "",
    imageAlt: "Between Seasons original painting",
    isSold: true,
    description:
      "A transitional landscape between summer and autumn palettes, painted directly from studio studies.",
    descriptionHe:
      "נוף מעברי בין פלטות הקיץ והסתיו, מצויר ישירות מתוך מחקרי סטודיו.",
    materials: "Acrylic on stretched canvas",
    widthCm: 70,
    heightCm: 90,
    yearCreated: 2024,
    shippingTimeNote: "Ships in a custom crate within 10–14 business days",
    images: [
      { id: "o2-1", seed: "original-2-main", alt: "Between Seasons, full view", kind: "main" },
      { id: "o2-2", seed: "original-2-detail", alt: "Between Seasons, detail", kind: "detail" },
    ],
  },
  {
    id: "original-3",
    type: "ORIGINAL",
    slug: "north-light",
    title: "North Light",
    titleHe: "אור צפוני",
    medium: "Oil on canvas",
    mediumHe: "שמן על בד",
    categoryName: "Interior",
    categoryNameHe: "פנים הבית",
    price: 4100,
    imageUrl: "",
    imageAlt: "North Light original painting",
    description:
      "An interior study built entirely around the cool, even quality of north-facing light.",
    descriptionHe:
      "מחקר פנים הבנוי כולו סביב האור הקריר והאחיד הפונה צפונה.",
    materials: "Oil on stretched canvas",
    widthCm: 100,
    heightCm: 130,
    yearCreated: 2025,
    shippingTimeNote: "Ships in a custom crate within 10–14 business days",
    images: [
      { id: "o3-1", seed: "original-3-main", alt: "North Light, full view", kind: "main" },
      { id: "o3-2", seed: "original-3-angle", alt: "North Light, angle view", kind: "angle" },
      { id: "o3-3", seed: "original-3-framed", alt: "North Light, framed", kind: "framed" },
    ],
  },
];

export function toCard(a: ArtworkDetailData): ArtworkCardData {
  const defaultSize = a.printSizes?.[0];
  const defaultFrame = a.frameOptions?.find((f) => f.isDefault) ?? a.frameOptions?.[0];

  return {
    id: a.id,
    type: a.type,
    slug: a.slug,
    title: a.title,
    titleHe: a.titleHe,
    medium: a.medium,
    mediumHe: a.mediumHe,
    price: a.price,
    imageUrl: a.imageUrl,
    imageAlt: a.imageAlt,
    isSold: a.isSold,
    inventory: a.type === "ORIGINAL" ? (a.inventory ?? 1) : undefined,
    quickAdd:
      a.type === "PRINT"
        ? {
            sizeId: defaultSize?.id,
            sizeLabel: defaultSize?.label,
            sizeInventory: defaultSize?.inventory,
            frameId: defaultFrame?.id,
            frameLabel: defaultFrame?.label,
          }
        : undefined,
  };
}

export const allPrints = allArtworks.filter((a) => a.type === "PRINT");
export const allOriginals = allArtworks.filter((a) => a.type === "ORIGINAL");

export const featuredPrints: ArtworkCardData[] = allPrints.slice(0, 4).map(toCard);
export const featuredOriginals: ArtworkCardData[] = allOriginals.slice(0, 3).map(toCard);

export const printMediums = Array.from(new Set(allPrints.map((a) => a.medium)));

export function getArtworkBySlug(type: "PRINT" | "ORIGINAL", slug: string) {
  return allArtworks.find((a) => a.type === type && a.slug === slug);
}

export function getRelatedArtworks(artwork: ArtworkDetailData, limit = 4): ArtworkCardData[] {
  return allArtworks
    .filter(
      (a) =>
        a.id !== artwork.id &&
        a.type === artwork.type &&
        a.categoryName === artwork.categoryName
    )
    .slice(0, limit)
    .map(toCard);
}
