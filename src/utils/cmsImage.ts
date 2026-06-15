import type { ImageMetadata } from 'astro';

// Eagerly glob all images stored in src/assets/.
// TinaCMS Cloud uploads to src/assets/ (the public/assets symlink points here).
// Eager import lets Astro statically analyze every image for build-time
// optimization while still allowing runtime path lookup by string.
const localImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,gif,svg,avif}',
  { eager: true }
);

/**
 * Resolve a TinaCMS image path (/assets/...) to Astro ImageMetadata.
 *
 * Returns ImageMetadata when the file exists locally in src/assets/,
 * allowing <Image> to optimize it. Returns undefined if not found
 * (caller should fall back to a plain <img>).
 */
export function getCmsImage(path: string | null | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  if (!path.startsWith('/assets/')) return undefined;
  // /assets/foo.jpg → /src/assets/foo.jpg (the glob key)
  return localImages[`/src${path}`]?.default;
}
