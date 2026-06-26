export type CourierType = "dhl" | "fedex" | "delhivery" | "bluedart" | "other";

export const COURIER_LABEL: Record<CourierType, string> = {
  dhl: "DHL Express",
  fedex: "FedEx",
  delhivery: "Delhivery",
  bluedart: "Blue Dart",
  other: "Other",
};

export const DEFAULT_LABEL_TEMPLATE = "standard_a4";
