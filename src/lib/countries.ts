/** Curated dial list — flag lives on the country control, never inside the phone input. */
export type Country = {
  iso: string;
  name: string;
  dial: string;
  flag: string;
};

export const COUNTRIES: readonly Country[] = [
  { iso: "MX", name: "México", dial: "52", flag: "🇲🇽" },
  { iso: "US", name: "Estados Unidos", dial: "1", flag: "🇺🇸" },
  { iso: "CA", name: "Canadá", dial: "1", flag: "🇨🇦" },
  { iso: "GT", name: "Guatemala", dial: "502", flag: "🇬🇹" },
  { iso: "SV", name: "El Salvador", dial: "503", flag: "🇸🇻" },
  { iso: "HN", name: "Honduras", dial: "504", flag: "🇭🇳" },
  { iso: "NI", name: "Nicaragua", dial: "505", flag: "🇳🇮" },
  { iso: "CR", name: "Costa Rica", dial: "506", flag: "🇨🇷" },
  { iso: "PA", name: "Panamá", dial: "507", flag: "🇵🇦" },
  { iso: "CO", name: "Colombia", dial: "57", flag: "🇨🇴" },
  { iso: "VE", name: "Venezuela", dial: "58", flag: "🇻🇪" },
  { iso: "PE", name: "Perú", dial: "51", flag: "🇵🇪" },
  { iso: "EC", name: "Ecuador", dial: "593", flag: "🇪🇨" },
  { iso: "BO", name: "Bolivia", dial: "591", flag: "🇧🇴" },
  { iso: "CL", name: "Chile", dial: "56", flag: "🇨🇱" },
  { iso: "AR", name: "Argentina", dial: "54", flag: "🇦🇷" },
  { iso: "UY", name: "Uruguay", dial: "598", flag: "🇺🇾" },
  { iso: "PY", name: "Paraguay", dial: "595", flag: "🇵🇾" },
  { iso: "BR", name: "Brasil", dial: "55", flag: "🇧🇷" },
  { iso: "ES", name: "España", dial: "34", flag: "🇪🇸" },
  { iso: "GB", name: "Reino Unido", dial: "44", flag: "🇬🇧" },
  { iso: "DE", name: "Alemania", dial: "49", flag: "🇩🇪" },
  { iso: "FR", name: "Francia", dial: "33", flag: "🇫🇷" },
  { iso: "IT", name: "Italia", dial: "39", flag: "🇮🇹" },
  { iso: "PT", name: "Portugal", dial: "351", flag: "🇵🇹" },
] as const;

export const DEFAULT_COUNTRY =
  COUNTRIES.find((c) => c.iso === "MX") ?? COUNTRIES[0];

/** Longest dial first so +52 beats shorter prefixes. */
const BY_DIAL = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);

export function countryByIso(iso: string): Country {
  return COUNTRIES.find((c) => c.iso === iso) ?? DEFAULT_COUNTRY;
}

/** Digits only. */
export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * If the value looks international (+52… / 0052…), pick country and return national digits.
 * Flag updates via the returned iso — never inject the flag into the input.
 */
export function parsePhoneInput(
  raw: string,
  currentIso: string,
): { iso: string; national: string } {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+") || trimmed.startsWith("00");
  let digits = digitsOnly(trimmed);

  if (trimmed.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (hasPlus || trimmed.startsWith("+")) {
    for (const c of BY_DIAL) {
      if (digits.startsWith(c.dial) && digits.length > c.dial.length) {
        // Prefer MX over US/CA when dial is "1" and length looks Mexican?
        // For dial "1", US/CA collision — keep first match US unless already CA/US.
        return { iso: c.iso, national: digits.slice(c.dial.length) };
      }
    }
  }

  // Autofill sometimes pastes country code without +
  if (digits.length >= 11) {
    for (const c of BY_DIAL) {
      if (digits.startsWith(c.dial) && digits.length - c.dial.length >= 7) {
        return { iso: c.iso, national: digits.slice(c.dial.length) };
      }
    }
  }

  return { iso: currentIso, national: digits };
}

export function formatInternational(iso: string, national: string) {
  const c = countryByIso(iso);
  const n = digitsOnly(national);
  return n ? `+${c.dial}${n}` : `+${c.dial}`;
}
