export type CourierType = "speedpost" | "delhivery" | "other";

export const COURIER_LABEL: Record<CourierType, string> = {
  speedpost: "India Post (Speed Post)",
  delhivery: "Delhivery",
  other: "Other",
};

export const DEFAULT_LABEL_TEMPLATE = "speedpost_a4";
