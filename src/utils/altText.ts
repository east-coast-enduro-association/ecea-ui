/**
 * Derive a human-readable alt-text fallback from an image path or filename.
 *
 * Use this ONLY as a fallback when no author-provided alt exists, so Astro's
 * <Image> never receives `undefined` (which throws at build time) and every
 * image still ships with *some* text alternative.
 *
 * Author-written alt is always better; this just prevents broken builds and
 * empty alt when a CMS image is added without one.
 *
 * @example
 * altFromImagePath("/assets/blog/race-recap-2026.jpg") // "Race recap 2026"
 * altFromImagePath("../../assets/clubs/logos/ber.gif") // "Ber"
 * altFromImagePath(undefined, "ECEA")                  // "ECEA"
 */
export function altFromImagePath(
  path: string | null | undefined,
  fallback = "Image"
): string {
  if (!path) return fallback;

  const file = path.split(/[\\/]/).pop() ?? "";
  const base = file.replace(/\.[a-z0-9]+$/i, ""); // strip extension

  const words = base
    .replace(/[_-]+/g, " ") // dashes / underscores -> spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> "camel Case"
    .replace(/\s+/g, " ")
    .trim();

  if (!words) return fallback;
  return words.charAt(0).toUpperCase() + words.slice(1);
}
