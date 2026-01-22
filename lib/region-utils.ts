import { RegionCode, REGIONS } from "@/types/database";

/**
 * Format currency based on region
 */
export function formatCurrency(amount: number, region: RegionCode): string {
  const config = REGIONS[region];
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(amount);
}

/**
 * Format currency with just the symbol (for inputs)
 */
export function getCurrencySymbol(region: RegionCode): string {
  return REGIONS[region].currencySymbol;
}

/**
 * Format date based on region
 */
export function formatDate(date: Date | string, region: RegionCode): string {
  const config = REGIONS[region];
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(config.locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Format date with time based on region and timezone
 */
export function formatDateTime(
  date: Date | string,
  region: RegionCode,
  timezone: string
): string {
  const config = REGIONS[region];
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(config.locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(d);
}

/**
 * Format time only based on region and timezone
 */
export function formatTime(
  date: Date | string,
  region: RegionCode,
  timezone: string
): string {
  const config = REGIONS[region];
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(config.locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(d);
}

/**
 * Format phone number based on region
 */
export function formatPhoneNumber(phone: string, region: RegionCode): string {
  const cleaned = phone.replace(/\D/g, "");

  switch (region) {
    case "US":
      // +1 (XXX) XXX-XXXX
      if (cleaned.length === 10) {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(
          3,
          6
        )}-${cleaned.slice(6)}`;
      }
      if (cleaned.length === 11 && cleaned.startsWith("1")) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(
          4,
          7
        )}-${cleaned.slice(7)}`;
      }
      break;
    case "IN":
      // +91 XXXXX XXXXX
      if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
      }
      if (cleaned.length === 12 && cleaned.startsWith("91")) {
        return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
      }
      break;
  }

  return phone; // Return original if no match
}

/**
 * Validate phone number based on region
 */
export function validatePhoneNumber(
  phone: string,
  region: RegionCode
): boolean {
  const cleaned = phone.replace(/\D/g, "");

  switch (region) {
    case "US":
      // 10 digits or 11 starting with 1
      return (
        cleaned.length === 10 ||
        (cleaned.length === 11 && cleaned.startsWith("1"))
      );
    case "IN":
      // 10 digits or 12 starting with 91
      return (
        cleaned.length === 10 ||
        (cleaned.length === 12 && cleaned.startsWith("91"))
      );
    default:
      return cleaned.length >= 10;
  }
}

/**
 * Normalize phone number to E.164 format
 */
export function normalizePhoneNumber(
  phone: string,
  region: RegionCode
): string {
  const cleaned = phone.replace(/\D/g, "");
  const prefix = REGIONS[region].phonePrefix.replace("+", "");

  // Add country code if missing
  if (!cleaned.startsWith(prefix)) {
    return `+${prefix}${cleaned}`;
  }

  return `+${cleaned}`;
}

/**
 * Get Deepgram language code for region
 */
export function getDeepgramLanguage(region: RegionCode): string {
  return REGIONS[region].deepgramLanguage;
}

/**
 * Get Twilio edge location for region (for lower latency)
 */
export function getTwilioEdge(region: RegionCode): string {
  return REGIONS[region].twilioEdge;
}

/**
 * Get phone placeholder based on region
 */
export function getPhonePlaceholder(region: RegionCode): string {
  switch (region) {
    case "US":
      return "+1 (555) 123-4567";
    case "IN":
      return "+91 98765 43210";
    default:
      return "+1 (555) 123-4567";
  }
}

/**
 * Get region from timezone (fallback heuristic)
 */
export function getRegionFromTimezone(timezone: string): RegionCode {
  const tzLower = timezone.toLowerCase();

  // India timezones - check first since more specific
  if (
    tzLower.includes("kolkata") ||
    tzLower.includes("calcutta") ||
    tzLower.includes("india") ||
    tzLower.includes("asia/kolkata") ||
    tzLower.includes("asia/calcutta") ||
    tzLower === "ist"
  ) {
    return "IN";
  }

  // US timezones
  if (
    tzLower.includes("america/") ||
    tzLower.includes("us/") ||
    tzLower.includes("pacific") ||
    tzLower.includes("eastern") ||
    tzLower.includes("central") ||
    tzLower.includes("mountain")
  ) {
    return "US";
  }

  // Default to US for unknown timezones
  return "US";
}
