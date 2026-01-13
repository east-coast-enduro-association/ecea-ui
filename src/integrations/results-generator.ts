/**
 * Astro Integration: Results Generator
 *
 * Watches for CSV/PDF files in src/data/results and generates markdown files
 * in src/content/blog at build time.
 *
 * Place your data files in:
 *   src/data/results/class-results.csv
 *   src/data/results/aa-advancement.csv
 *
 * Generated files will be created in:
 *   src/content/blog/
 */

import type { AstroIntegration } from 'astro';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ResultsGeneratorOptions {
  /** Directory containing source data files */
  dataDir?: string;
  /** Directory to output generated markdown */
  outputDir?: string;
  /** Whether to run in dev mode */
  runInDev?: boolean;
}

export default function resultsGenerator(options: ResultsGeneratorOptions = {}): AstroIntegration {
  const {
    dataDir = 'src/data/results',
    outputDir = 'src/content/blog',
    runInDev = false,
  } = options;

  return {
    name: 'results-generator',
    hooks: {
      'astro:config:setup': async ({ command, logger }) => {
        // Only run on build, or dev if enabled
        if (command !== 'build' && !(command === 'dev' && runInDev)) {
          return;
        }

        logger.info('Checking for results data files...');

        const rootDir = process.cwd();
        const dataPath = path.join(rootDir, dataDir);
        const outputPath = path.join(rootDir, outputDir);

        // Ensure directories exist
        if (!fs.existsSync(dataPath)) {
          logger.info(`Data directory not found: ${dataPath}`);
          logger.info('Create this directory and add CSV files to auto-generate results pages.');
          return;
        }

        // Process CSV files
        const csvFiles = fs.readdirSync(dataPath).filter(f => f.endsWith('.csv'));

        for (const csvFile of csvFiles) {
          const csvPath = path.join(dataPath, csvFile);
          const baseName = path.basename(csvFile, '.csv');

          logger.info(`Processing: ${csvFile}`);

          try {
            // Determine output filename and type based on input filename
            let outputFile: string;
            let scriptArgs: string;

            if (baseName.toLowerCase().includes('class')) {
              outputFile = `${getDatePrefix()}-enduro-class-results-generated.md`;
              scriptArgs = `--group-by Class --remove-group-col --title-case "Rider Name"`;
            } else if (baseName.toLowerCase().includes('aa') || baseName.toLowerCase().includes('advancement')) {
              outputFile = `${getDatePrefix()}-aa-advancement-generated.md`;
              scriptArgs = `--title-case "Rider Name"`;
            } else {
              outputFile = `${getDatePrefix()}-${baseName}-generated.md`;
              scriptArgs = '';
            }

            const outputFilePath = path.join(outputPath, outputFile);
            const scriptPath = path.join(rootDir, 'src/utils/csv-to-markdown.py');

            // Check if script exists
            if (!fs.existsSync(scriptPath)) {
              logger.warn(`CSV parser script not found: ${scriptPath}`);
              continue;
            }

            // Run the CSV to markdown script
            const cmd = `python3 "${scriptPath}" "${csvPath}" ${scriptArgs}`;
            const markdown = execSync(cmd, { encoding: 'utf-8' });

            // Create frontmatter
            const frontmatter = generateFrontmatter(baseName, csvFile);
            const fullContent = frontmatter + markdown;

            // Write output file
            fs.writeFileSync(outputFilePath, fullContent);
            logger.info(`Generated: ${outputFile}`);

          } catch (error) {
            logger.error(`Failed to process ${csvFile}: ${error}`);
          }
        }

        // Process PDF files (if pdfplumber is available)
        const pdfFiles = fs.readdirSync(dataPath).filter(f => f.endsWith('.pdf'));

        for (const pdfFile of pdfFiles) {
          const pdfPath = path.join(dataPath, pdfFile);
          const baseName = path.basename(pdfFile, '.pdf');

          logger.info(`Processing: ${pdfFile}`);

          try {
            let outputFile: string;
            let pdfType: string;

            if (baseName.toLowerCase().includes('class')) {
              outputFile = `${getDatePrefix()}-enduro-class-results-generated.md`;
              pdfType = 'class';
            } else if (baseName.toLowerCase().includes('aa') || baseName.toLowerCase().includes('advancement')) {
              outputFile = `${getDatePrefix()}-aa-advancement-generated.md`;
              pdfType = 'aa';
            } else {
              outputFile = `${getDatePrefix()}-${baseName}-generated.md`;
              pdfType = 'auto';
            }

            const outputFilePath = path.join(outputPath, outputFile);
            const scriptPath = path.join(rootDir, 'src/utils/pdf-to-markdown.py');

            if (!fs.existsSync(scriptPath)) {
              logger.warn(`PDF parser script not found: ${scriptPath}`);
              continue;
            }

            // Run the PDF to markdown script
            const cmd = `python3 "${scriptPath}" "${pdfPath}" --type ${pdfType}`;
            const markdown = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

            // Create frontmatter
            const frontmatter = generateFrontmatter(baseName, pdfFile);
            const fullContent = frontmatter + markdown;

            // Write output file
            fs.writeFileSync(outputFilePath, fullContent);
            logger.info(`Generated: ${outputFile}`);

          } catch (error) {
            logger.error(`Failed to process ${pdfFile}: ${error}`);
          }
        }

        logger.info('Results generation complete.');
      },
    },
  };
}

function getDatePrefix(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function generateFrontmatter(baseName: string, sourceFile: string): string {
  const now = new Date().toISOString();
  const year = new Date().getFullYear();

  let title: string;
  let description: string;
  let tags: string[];

  if (baseName.toLowerCase().includes('class')) {
    title = `${year} ECEA Enduro Championship Class Results`;
    description = `Official ${year} ECEA Championship Enduro Series Points Standings by Class`;
    tags = [`'${year}'`, 'enduro', 'results', 'championship'];
  } else if (baseName.toLowerCase().includes('aa') || baseName.toLowerCase().includes('advancement')) {
    title = `${year} ECEA Enduro Series - AA Advancements`;
    description = `Official AA class advancements for the ${year + 1} ECEA Enduro season`;
    tags = [`'${year}'`, `'${year + 1}'`, 'enduro', 'results', 'AA', 'advancement'];
  } else {
    title = `${year} ECEA Results - ${baseName}`;
    description = `Generated from ${sourceFile}`;
    tags = [`'${year}'`, 'enduro', 'results'];
  }

  return `---
title: "${title}"
pubDate: '${now}'
description: "${description}"
author: ECEA
category: news
draft: false
image:
  src: '../../assets/blog/ecea-small.png'
  alt: ${title}
tags:
  - ${tags.join('\n  - ')}
---

`;
}
