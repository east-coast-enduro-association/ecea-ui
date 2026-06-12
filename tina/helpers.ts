// =============================================================================
// Image UI Helpers
// =============================================================================

/**
 * Generates the TinaCMS `ui` object for image fields.
 *
 * TinaCMS Cloud saves images as absolute paths (/assets/...) but Astro's
 * image() requires relative paths. `parse` converts on local dev; for Cloud
 * builds the real fix is `normalizeAssetPath` in src/content/config.ts.
 * `previewSrc` converts relative paths back to absolute for the editor preview.
 *
 * @param depth - Number of directory levels above src/ the content file lives
 *                (e.g., events files are 3 deep: src/content/events/YYYY/file.md)
 */
export function imageUi(depth: number) {
  const prefix = '../'.repeat(depth);
  return {
    parse: (media: string) => {
      if (!media) return '';
      if (media.startsWith('/assets/')) return prefix + media.slice(1);
      return media;
    },
    previewSrc: (value: string) => {
      if (!value) return '';
      const relPrefix = prefix + 'assets/';
      if (value.startsWith(relPrefix)) return '/assets/' + value.slice(relPrefix.length);
      return value;
    },
  };
}

// =============================================================================
// Validation Helpers
// =============================================================================

/** Returns an error message if the value is not a valid http(s) URL. */
export const validateUrl = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return 'URL must start with http:// or https://';
  }
  return undefined;
};

/** Returns an error message if the value is not a valid email address. */
export const validateEmail = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address (e.g., name@example.com)';
  }
  return undefined;
};
