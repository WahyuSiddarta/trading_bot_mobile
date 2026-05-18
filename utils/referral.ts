import type { AuxiliaryValue, ReferralNode } from "@/hooks/use-query";

export type ReferralMeta = {
  activated: boolean;
};

export function getAuxiliaryMap(auxiliary: ReferralNode["auxiliary"]) {
  return auxiliary.reduce<Record<string, AuxiliaryValue>>(
    (result, item) => ({ ...result, ...item }),
    {},
  );
}

export function getAuxiliaryEntries(auxiliary: ReferralNode["auxiliary"]) {
  return Object.entries(getAuxiliaryMap(auxiliary)).map(([key, value]) => ({
    key,
    value,
  }));
}

export function parseAuxiliary(
  auxiliary: ReferralNode["auxiliary"],
): ReferralMeta {
  const mergedAuxiliary = getAuxiliaryMap(auxiliary);

  return {
    activated: Boolean(mergedAuxiliary.activated),
  };
}

export function formatAuxiliaryLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isNumericLike(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

function formatNumberValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 5,
  }).format(value);
}

export function formatAuxiliaryValue(value: AuxiliaryValue) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return formatNumberValue(value);
  }

  if (isNumericLike(value)) {
    return formatNumberValue(Number(value));
  }

  return value;
}
