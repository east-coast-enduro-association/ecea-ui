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
 * Normalize any image path variant used in content files to the glob key
 * format (/src/assets/...) used by import.meta.glob.
 *
 * Content files use several path formats depending on how they were created:
 *   TinaCMS Cloud:  /assets/events/flyers/foo.jpg   (absolute)
 *   Manual/legacy:  ../../../assets/clubs/logos/foo.png  (relative)
 *   Alias:          @assets/ecea/logos/foo.png
 */
function toGlobKey(path: string): string | undefined {
  // Absolute: /assets/foo → /src/assets/foo
  if (path.startsWith('/assets/')) return `/src${path}`;
  // Alias: @assets/foo → /src/assets/foo
  if (path.startsWith('@assets/')) return `/src/assets/${path.slice('@assets/'.length)}`;
  // Relative: ../../assets/foo or ../../../assets/foo → /src/assets/foo
  const assetsIdx = path.indexOf('/assets/');
  if (assetsIdx !== -1) return `/src/assets/${path.slice(assetsIdx + '/assets/'.length)}`;
  return undefined;
}

/**
 * Resolve any content image path to Astro ImageMetadata for build-time
 * optimization. Returns undefined if not found; caller should fall back
 * to a plain <img loading="lazy">.
 */
export function getCmsImage(path: string | null | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = toGlobKey(path);
  if (!key) return undefined;
  return localImages[key]?.default;
}
