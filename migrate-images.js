import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

// --- ⚙️ CONFIGURATION ---

const CONFIG = {
  // 1. Search all content files (events, clubs, sermons, etc.)
  mdFiles: 'src/content/**/*.{md,mdx}',

  // 2. Define your mapping groups
  groups: [
    {
      // GROUP A: The "Images" folder (Keep as-is, just move to src/assets)
      prefix: '/images/',
      sourceRoot: 'public/images',
      destRoot: 'src/assets/images',
      newAlias: '@assets/images'    // Result: @assets/images/event.jpg
    },
    {
      // GROUP B: The "Uploads" folder (Flatten! Remove 'uploads' from path)
      prefix: '/uploads/',
      sourceRoot: 'public/uploads',
      destRoot: 'src/assets',       // Move directly to root of assets
      newAlias: '@assets'           // Result: @assets/clubs/logo.jpg (Cleaner!)
    }
  ],

  // 3. Frontmatter keys to check
  keys: ['cover', 'image', 'hero', 'thumbnail', 'logo', 'flyer'],

  // 4. Set to FALSE to actually apply changes
  dryRun: false
};

// -------------------------

function migrate() {
  console.log('🚀 Starting Smart Migration...');
  if (CONFIG.dryRun) console.log('ℹ️  DRY RUN MODE: No changes will be saved.\n');

  const files = globSync(CONFIG.mdFiles);
  let totalMoved = 0;
  let totalUpdated = 0;

  files.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(fileContent);
    let hasChanges = false;

    // Processor function
    const processPath = (currentPath) => {
      if (!currentPath || typeof currentPath !== 'string') return currentPath;

      // Find which group this path belongs to
      const group = CONFIG.groups.find(g => currentPath.startsWith(g.prefix));
      if (!group) return currentPath; // No match, leave it alone

      // 1. Calculate relative file path (e.g. "clubs/logo.jpg")
      const relativeFile = currentPath.substring(group.prefix.length);

      // 2. Define Source and Destination
      const sourceFile = path.join(group.sourceRoot, relativeFile);
      const destFile = path.join(group.destRoot, relativeFile);
      const destFolder = path.dirname(destFile);

      // 3. Move File (only if it exists in source)
      if (fs.existsSync(sourceFile)) {
        if (!CONFIG.dryRun) {
          if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

          // Only move if destination doesn't exist yet (prevent overwrites)
          if (!fs.existsSync(destFile)) {
            fs.renameSync(sourceFile, destFile);
            console.log(`📦 Moved: ${relativeFile}`);
          }
        } else {
          console.log(`📦 [Dry Run] Would move: ${relativeFile} \n             To: ${destFile}`);
        }
        totalMoved++;
      } else if (!fs.existsSync(destFile)) {
        // Only warn if it's missing from BOTH source and destination
        console.warn(`⚠️  Warning: File referenced in ${path.basename(filePath)} not found at ${sourceFile}`);
      }

      // 4. Return new Alias path
      // Combine the clean alias with the relative filename
      return `${group.newAlias}/${relativeFile}`;
    };

    // --- Update Frontmatter ---
    CONFIG.keys.forEach(key => {
      if (parsed.data[key]) {
        const oldVal = parsed.data[key];
        const newVal = processPath(oldVal);
        if (oldVal !== newVal) {
          parsed.data[key] = newVal;
          hasChanges = true;
          console.log(`📝 [Frontmatter] ${path.basename(filePath)}: ${oldVal} \n             -> ${newVal}`);
        }
      }
    });

    // --- Update Body (Images only) ---
    // Regex matches Markdown images: ![alt](/prefix/...)
    // It does NOT match standard links [text](/prefix/...), preserving PDFs/Downloads in public/
    const prefixes = CONFIG.groups.map(g => g.prefix).join('|');
    const bodyRegex = new RegExp(`!\\[(.*?)\\]\\((${prefixes})(.*?)( ".*?")?\\)`, 'g');

    let newBody = parsed.content.replace(bodyRegex, (match, alt, prefix, rest, title) => {
      const fullPath = prefix + rest;
      const newPath = processPath(fullPath);
      if (newPath !== fullPath) {
        hasChanges = true;
        console.log(`📝 [Body] ${path.basename(filePath)} updated image link.`);
        return `![${alt}](${newPath}${title || ''})`;
      }
      return match;
    });

    // --- Save ---
    if (hasChanges) {
      if (!CONFIG.dryRun) {
        const newContent = matter.stringify(newBody, parsed.data);
        fs.writeFileSync(filePath, newContent);
      }
      totalUpdated++;
    }
  });

  console.log('\n--- SUMMARY ---');
  console.log(`Files Scanned: ${files.length}`);
  console.log(`Files Updated: ${totalUpdated}`);
  console.log(`Images Moved:  ${totalMoved}`);
  if (CONFIG.dryRun) console.log('⚠️  DRY RUN. Set dryRun: false inside the script to execute.');
}

migrate();
