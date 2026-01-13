# Results Data Files

Place CSV or PDF files in this directory to automatically generate blog posts at build time.

## Supported File Types

- `.csv` - Comma-separated values
- `.pdf` - PDF files (requires pdfplumber)

## Naming Convention

The file name determines the type of content generated:

| Filename contains | Generated content |
|-------------------|-------------------|
| `class` | Class results with grouped tables |
| `aa` or `advancement` | AA advancement standings |
| Other | Generic results table |

## Examples

```
src/data/results/
├── 2025-class-results.csv      → generates class results blog post
├── 2025-aa-advancement.csv     → generates AA advancement blog post
└── 2025-team-standings.csv     → generates generic results post
```

## CSV Format

### Class Results CSV
```csv
Place,Club,Rider Name,Class,Brand,Events,Total
1,TCSMC,KYLE MCDONAL,AA,BET,12,297
2,OCCR,RYAN CANAVAN,AA,HUS,12,227
```

### AA Advancement CSV
```csv
Place,Rider Name,Club,Class,Brand,Total,Events,Avg Pts,Net Total
1,Kyle McDonal,TCSMC,AA,BET,337,14,24,313
2,Ryan Canavan,OCCR,AA,HUS,241,14,17,224
```

## Build

Files are processed during `astro build`. Generated markdown files are placed in `src/content/blog/`.

To test locally:
```bash
npm run build
```
