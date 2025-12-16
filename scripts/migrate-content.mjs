#!/usr/bin/env node
/**
 * ECEA Content Migration Script
 * Migrates Hugo content to Astro content collections
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MASTER_DIR = path.resolve(__dirname, '../../master');
const MIGRATION_DIR = path.resolve(__dirname, '..');

// Helper to parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterRaw = match[1];
  const body = match[2];

  // Simple YAML parser for our needs
  const frontmatter = {};
  let currentKey = null;
  let currentArray = null;
  let currentObject = null;
  let objectKey = null;

  const lines = frontmatterRaw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) continue;

    // Check for array item
    if (line.match(/^\s+-\s+/)) {
      const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      if (currentArray) {
        currentArray.push(value);
      }
      continue;
    }

    // Check for nested object key-value (like attachment1:)
    const nestedMatch = line.match(/^\s{2,}(\w+):\s*(.*)$/);
    if (nestedMatch && currentObject) {
      const [, key, val] = nestedMatch;
      if (key === 'filepath' || key === 'label' || key === 'info' || key === 'link' || key === 'path') {
        if (!currentObject[objectKey]) currentObject[objectKey] = {};
        currentObject[objectKey][key] = val.trim().replace(/^["']|["']$/g, '');
      } else if (val) {
        if (!currentObject[key]) currentObject[key] = {};
        objectKey = key;
      } else {
        objectKey = key;
        currentObject[key] = {};
      }
      continue;
    }

    // Check for key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentKey = key;
      currentArray = null;
      currentObject = null;

      if (!value || value === '') {
        // Could be array or object
        const nextLine = lines[i + 1] || '';
        if (nextLine.match(/^\s+-/)) {
          frontmatter[key] = [];
          currentArray = frontmatter[key];
        } else if (nextLine.match(/^\s{2,}\w+:/)) {
          frontmatter[key] = {};
          currentObject = frontmatter[key];
        }
      } else {
        // Clean up the value
        let cleanValue = value.trim().replace(/^["']|["']$/g, '');

        // Handle booleans
        if (cleanValue === 'true') cleanValue = true;
        else if (cleanValue === 'false') cleanValue = false;
        // Handle quoted booleans
        else if (cleanValue === "'Yes'" || cleanValue === '"Yes"') cleanValue = true;
        else if (cleanValue === "'No'" || cleanValue === '"No"') cleanValue = false;

        frontmatter[key] = cleanValue;
      }
    }
  }

  return { frontmatter, body };
}

// Convert Hugo event to Astro event schema
function convertEvent(hugoFrontmatter, body, filename) {
  const astro = {
    title: hugoFrontmatter.title || 'Untitled Event',
    summary: hugoFrontmatter.description || '',
    draft: hugoFrontmatter.draft === true || hugoFrontmatter.draft === 'true',
    date: hugoFrontmatter.event_datetime || hugoFrontmatter.date,
    location: hugoFrontmatter.location || 'TBD',
    hostingClubs: Array.isArray(hugoFrontmatter.club) ? hugoFrontmatter.club :
                  hugoFrontmatter.club ? [hugoFrontmatter.club] : [],
  };

  // Event type mapping
  const typeMap = {
    'Enduro': 'Enduro',
    'Hare Scramble': 'Hare Scramble',
    'FastKIDZ': 'FastKIDZ',
    'Dual Sport': 'Dual Sport',
    'Special': 'Special',
    'Meeting': 'Meeting'
  };
  if (hugoFrontmatter.event_type && typeMap[hugoFrontmatter.event_type]) {
    astro.eventType = typeMap[hugoFrontmatter.event_type];
  }

  // Optional fields
  if (hugoFrontmatter.event_format) astro.format = hugoFrontmatter.event_format;
  if (hugoFrontmatter.event_series) astro.series = hugoFrontmatter.event_series;
  if (hugoFrontmatter.key_time) astro.keyTime = hugoFrontmatter.key_time;
  if (hugoFrontmatter.check_in_time) astro.checkInTime = hugoFrontmatter.check_in_time;

  // Boolean fields with Hugo quirks
  astro.closedCourse = hugoFrontmatter.closed_course === true ||
                       hugoFrontmatter.closed_course === "'Yes'" ||
                       hugoFrontmatter.closed_course === 'Yes';
  astro.gasAway = hugoFrontmatter.gas_away === true ||
                  hugoFrontmatter.gas_away === "'Yes'" ||
                  hugoFrontmatter.gas_away === 'Yes';

  // Image handling - convert Hugo paths to Astro asset paths
  if (hugoFrontmatter.preview_image) {
    astro.image = '@assets/' + hugoFrontmatter.preview_image.replace('images/', '');
  }
  if (hugoFrontmatter.flyer) {
    astro.flyer = '@assets/' + hugoFrontmatter.flyer.replace('images/', '');
  }

  // Links
  if (hugoFrontmatter.registration_url && hugoFrontmatter.registration_url !== '') {
    astro.registrationLink = hugoFrontmatter.registration_url;
  }
  if (hugoFrontmatter.start_grid && hugoFrontmatter.start_grid !== '') {
    astro.startGridLink = hugoFrontmatter.start_grid;
  }

  // Downloads from attachments
  if (hugoFrontmatter.attachments) {
    const downloads = [];
    for (const [key, attachment] of Object.entries(hugoFrontmatter.attachments)) {
      if (attachment && attachment.filepath && attachment.label) {
        downloads.push({
          label: attachment.label,
          url: '/' + attachment.filepath.replace(/^\//, '').replace('"/', '/')
        });
      }
    }
    if (downloads.length > 0) {
      astro.downloads = downloads;
    }
  }

  return { frontmatter: astro, body };
}

// Convert Hugo blog post to Astro blog schema
function convertBlogPost(hugoFrontmatter, body, filename) {
  const astro = {
    title: hugoFrontmatter.title || 'Untitled Post',
    pubDate: hugoFrontmatter.date,
    description: hugoFrontmatter.description || '',
    author: hugoFrontmatter.author || 'ECEA',
    draft: hugoFrontmatter.draft === true || hugoFrontmatter.draft === 'true',
  };

  // Image handling
  if (hugoFrontmatter.image) {
    const imagePath = hugoFrontmatter.image.replace('images/', '');
    astro.image = {
      url: '/images/' + imagePath,
      alt: hugoFrontmatter.title || 'Blog post image'
    };
  }

  // Tags
  if (hugoFrontmatter.tags && Array.isArray(hugoFrontmatter.tags)) {
    astro.tags = hugoFrontmatter.tags;
  } else if (hugoFrontmatter.categories && Array.isArray(hugoFrontmatter.categories)) {
    astro.tags = hugoFrontmatter.categories;
  }

  return { frontmatter: astro, body };
}

// Convert Hugo club to Astro club schema
function convertClub(hugoFrontmatter, body, filename) {
  // Parse the information array into structured data
  const info = {};
  if (hugoFrontmatter.information && Array.isArray(hugoFrontmatter.information)) {
    // This is an array format, skip for now
  } else if (hugoFrontmatter.information) {
    for (const item of Object.values(hugoFrontmatter.information)) {
      if (item.label && item.info) {
        const key = item.label.toLowerCase().replace(/\s+/g, '_');
        info[key] = item.info;
      }
    }
  }

  // Extract abbreviation from filename or description
  const abbr = filename.replace('.md', '').toUpperCase();

  const astro = {
    name: hugoFrontmatter.title || info.club || 'Unknown Club',
    abbreviatedName: abbr,
    summary: hugoFrontmatter.description || '',
    draft: hugoFrontmatter.draft === true || hugoFrontmatter.draft === 'true',
  };

  // Logo
  if (hugoFrontmatter.image) {
    astro.logo = '@assets/' + hugoFrontmatter.image.replace('images/', '');
  }

  // Contact info from information array
  if (info.website) astro.website = info.website;
  if (info.contact_email) astro.contact = info.contact_email;
  if (info.address) astro.location = info.address;

  return { frontmatter: astro, body };
}

// Convert Hugo series to Astro series schema
function convertSeries(hugoFrontmatter, body, filename) {
  const astro = {
    name: hugoFrontmatter.title || 'Unknown Series',
    description: hugoFrontmatter.description || '',
    draft: hugoFrontmatter.draft === true || hugoFrontmatter.draft === 'true',
  };

  // Documents
  if (hugoFrontmatter.documents) {
    const documents = [];
    for (const doc of Object.values(hugoFrontmatter.documents)) {
      if (doc.label && doc.path) {
        documents.push({
          label: doc.label,
          url: doc.path
        });
      }
    }
    if (documents.length > 0) {
      astro.documents = documents;
    }
  }

  // FAQ Links
  if (hugoFrontmatter.information) {
    const faqLinks = [];
    for (const item of Object.values(hugoFrontmatter.information)) {
      if (item.label && item.link) {
        faqLinks.push({
          label: item.label,
          url: item.link
        });
      }
    }
    if (faqLinks.length > 0) {
      astro.faqLinks = faqLinks;
    }
  }

  return { frontmatter: astro, body };
}

// Serialize frontmatter to YAML
function serializeFrontmatter(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      yaml += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          yaml += `${spaces}  - label: ${item.label}\n`;
          yaml += `${spaces}    url: ${item.url}\n`;
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`;
      for (const [k, v] of Object.entries(value)) {
        yaml += `${spaces}  ${k}: ${v}\n`;
      }
    } else if (typeof value === 'boolean') {
      yaml += `${spaces}${key}: ${value}\n`;
    } else if (typeof value === 'string' && (value.includes(':') || value.includes('#') || value.includes("'") || value.startsWith('@'))) {
      yaml += `${spaces}${key}: '${value.replace(/'/g, "''")}'\n`;
    } else {
      yaml += `${spaces}${key}: ${value}\n`;
    }
  }

  return yaml;
}

// Write migrated file
async function writeMigratedFile(destPath, frontmatter, body) {
  const content = `---\n${serializeFrontmatter(frontmatter)}---\n${body}`;
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, content, 'utf-8');
}

// Migrate events
async function migrateEvents() {
  console.log('\n📅 Migrating events...');
  const eventsDir = path.join(MASTER_DIR, 'content/english/events');
  const destDir = path.join(MIGRATION_DIR, 'src/content/events');

  // Clear existing events
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  let count = 0;

  async function processDir(dir, year = null) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Determine if this is a year directory
        const dirYear = entry.name.match(/^20\d{2}$/) ? entry.name : year;
        await processDir(fullPath, dirYear);
      } else if (entry.name.endsWith('.md') && entry.name !== '_index.md') {
        const content = await fs.readFile(fullPath, 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);
        const converted = convertEvent(frontmatter, body, entry.name);

        // Determine destination folder based on year from date or directory
        let destYear = year;
        if (!destYear && converted.frontmatter.date) {
          const dateMatch = String(converted.frontmatter.date).match(/^(\d{4})/);
          if (dateMatch) destYear = dateMatch[1];
        }
        destYear = destYear || 'misc';

        const destPath = path.join(destDir, destYear, entry.name);
        await writeMigratedFile(destPath, converted.frontmatter, converted.body);
        count++;
      }
    }
  }

  await processDir(eventsDir);
  console.log(`   ✅ Migrated ${count} events`);
  return count;
}

// Migrate blog posts
async function migrateBlog() {
  console.log('\n📝 Migrating blog posts...');
  const blogDir = path.join(MASTER_DIR, 'content/english/blog');
  const destDir = path.join(MIGRATION_DIR, 'src/content/blog');

  // Clear existing blog posts
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  const entries = await fs.readdir(blogDir);
  let count = 0;

  for (const entry of entries) {
    if (!entry.endsWith('.md') || entry === '_index.md') continue;

    const fullPath = path.join(blogDir, entry);
    const content = await fs.readFile(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const converted = convertBlogPost(frontmatter, body, entry);

    // Generate slug from filename (remove date prefix)
    const slug = entry.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');

    const destPath = path.join(destDir, `${slug}.md`);
    await writeMigratedFile(destPath, converted.frontmatter, converted.body);
    count++;
  }

  console.log(`   ✅ Migrated ${count} blog posts`);
  return count;
}

// Migrate clubs
async function migrateClubs() {
  console.log('\n🏁 Migrating clubs...');
  const clubsDir = path.join(MASTER_DIR, 'content/english/clubs');
  const destDir = path.join(MIGRATION_DIR, 'src/content/clubs');

  // Clear existing clubs
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  const entries = await fs.readdir(clubsDir);
  let count = 0;

  for (const entry of entries) {
    if (!entry.endsWith('.md') || entry === '_index.md') continue;

    const fullPath = path.join(clubsDir, entry);
    const content = await fs.readFile(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const converted = convertClub(frontmatter, body, entry);

    const destPath = path.join(destDir, entry);
    await writeMigratedFile(destPath, converted.frontmatter, converted.body);
    count++;
  }

  console.log(`   ✅ Migrated ${count} clubs`);
  return count;
}

// Migrate series
async function migrateSeries() {
  console.log('\n🏆 Migrating series...');
  const seriesDir = path.join(MASTER_DIR, 'content/english/series');
  const destDir = path.join(MIGRATION_DIR, 'src/content/series');

  // Clear existing series
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  const entries = await fs.readdir(seriesDir);
  let count = 0;

  for (const entry of entries) {
    if (!entry.endsWith('.md') || entry === '_index.md') continue;

    const fullPath = path.join(seriesDir, entry);
    const content = await fs.readFile(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const converted = convertSeries(frontmatter, body, entry);

    const destPath = path.join(destDir, entry);
    await writeMigratedFile(destPath, converted.frontmatter, converted.body);
    count++;
  }

  console.log(`   ✅ Migrated ${count} series`);
  return count;
}

// Migrate static pages (faq, contact, etc.)
async function migratePages() {
  console.log('\n📄 Migrating pages...');
  const contentDir = path.join(MASTER_DIR, 'content/english');
  const destDir = path.join(MIGRATION_DIR, 'src/content/pages');

  // Clear existing pages
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  const pageFiles = ['faq.md', 'get-started.md', 'service.md', 'team_results.md'];
  let count = 0;

  for (const file of pageFiles) {
    const fullPath = path.join(contentDir, file);
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const destPath = path.join(destDir, file);
      await fs.writeFile(destPath, content, 'utf-8');
      count++;
    } catch (e) {
      // File doesn't exist, skip
    }
  }

  console.log(`   ✅ Migrated ${count} pages`);
  return count;
}

// Copy static assets
async function copyAssets() {
  console.log('\n🖼️  Copying assets...');

  // Copy images from static/images to src/assets
  const sourceImages = path.join(MASTER_DIR, 'static/images');
  const destImages = path.join(MIGRATION_DIR, 'src/assets/images');

  await fs.rm(destImages, { recursive: true, force: true });
  await fs.cp(sourceImages, destImages, { recursive: true });

  // Copy documents
  const sourceDocs = path.join(MASTER_DIR, 'static/documents');
  const destDocs = path.join(MIGRATION_DIR, 'public/documents');

  await fs.rm(destDocs, { recursive: true, force: true });
  await fs.cp(sourceDocs, destDocs, { recursive: true });

  // Copy attachments
  const sourceAttach = path.join(MASTER_DIR, 'static/attachments');
  const destAttach = path.join(MIGRATION_DIR, 'public/attachments');

  await fs.rm(destAttach, { recursive: true, force: true });
  await fs.cp(sourceAttach, destAttach, { recursive: true });

  // Copy events folder (PDFs, etc.)
  const sourceEvents = path.join(MASTER_DIR, 'static/events');
  const destEvents = path.join(MIGRATION_DIR, 'public/events');

  await fs.rm(destEvents, { recursive: true, force: true });
  await fs.cp(sourceEvents, destEvents, { recursive: true });

  // Count assets
  const countFiles = async (dir) => {
    try {
      let count = 0;
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          count += await countFiles(path.join(dir, entry.name));
        } else {
          count++;
        }
      }
      return count;
    } catch {
      return 0;
    }
  };

  const imageCount = await countFiles(destImages);
  const docsCount = await countFiles(destDocs);
  const attachCount = await countFiles(destAttach);
  const eventsCount = await countFiles(destEvents);

  console.log(`   ✅ Copied ${imageCount} images`);
  console.log(`   ✅ Copied ${docsCount} documents`);
  console.log(`   ✅ Copied ${attachCount} attachments`);
  console.log(`   ✅ Copied ${eventsCount} event files`);

  return imageCount + docsCount + attachCount + eventsCount;
}

// Main migration
async function main() {
  console.log('🚀 ECEA Content Migration');
  console.log('========================');
  console.log(`Source: ${MASTER_DIR}`);
  console.log(`Destination: ${MIGRATION_DIR}`);

  const results = {
    events: await migrateEvents(),
    blog: await migrateBlog(),
    clubs: await migrateClubs(),
    series: await migrateSeries(),
    pages: await migratePages(),
    assets: await copyAssets(),
  };

  console.log('\n✨ Migration complete!');
  console.log('Summary:');
  console.log(`  - Events: ${results.events}`);
  console.log(`  - Blog posts: ${results.blog}`);
  console.log(`  - Clubs: ${results.clubs}`);
  console.log(`  - Series: ${results.series}`);
  console.log(`  - Pages: ${results.pages}`);
  console.log(`  - Assets: ${results.assets}`);
}

main().catch(console.error);
