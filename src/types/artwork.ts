export type ArtworkType = "PRINT" | "ORIGINAL";

export type ArtworkCardData = {
  id: string;
  type: ArtworkType;
  slug: string;
  title: string;
  titleHe?: string;
  medium: string;
  mediumHe?: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  isSold?: boolean;
  /** Available copies (originals only; prints use per-size inventory). Not shown publicly. */
  inventory?: number;
  /** Default size/frame used for one-click "Add to Cart" from a grid card. */
  quickAdd?: {
    sizeId?: string;
    sizeLabel?: string;
    sizeInventory?: number;
    frameId?: string;
    frameLabel?: string;
  };
};

export type ArtworkImageData = {
  id: string;
  seed: string;
  alt: string;
  kind: "main" | "detail" | "angle" | "framed" | "unframed" | "lifestyle";
};

export type PrintSizeData = {
  id: string;
  label: string;
  widthCm: number;
  heightCm: number;
  price: number;
  inventory: number;
};

export type FrameOptionData = {
  id: string;
  label: string;
  priceDelta: number;
  isDefault?: boolean;
};

export type ArtworkDetailData = ArtworkCardData & {
  description: string;
  descriptionHe?: string;
  materials?: string;
  categoryName: string;
  categoryNameHe?: string;
  images: ArtworkImageData[];
  // Print-only
  printSizes?: PrintSizeData[];
  frameOptions?: FrameOptionData[];
  estimatedDelivery?: string;
  // Original-only
  widthCm?: number;
  heightCm?: number;
  yearCreated?: number;
  shippingTimeNote?: string;
};
