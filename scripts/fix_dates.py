import os
import re
import yaml
from datetime import datetime, date
from pathlib import Path

# ================= CONFIGURATION =================
# Resolve paths relative to this script file
PROJECT_ROOT = Path(__file__).resolve().parent.parent
TARGET_DIR = PROJECT_ROOT / "src/content/events"

# Fields to inspect and fix
DATE_FIELDS = ["date", "keyTime", "checkInTime", "endDate", "pubDate"]
# =================================================

def fix_date_format(value):
    """
    Parses various date formats and returns a standard ISO string (YYYY-MM-DDTHH:MM:SS)
    or just YYYY-MM-DD if no time is present.
    """
    if value is None:
        return None

    # If it's an empty string, return None (signal to delete)
    if isinstance(value, str) and value.strip() == "":
        return None

    # If it's already a datetime object (PyYAML parsed it)
    if isinstance(value, datetime):
        # Convert to string with 'T' separator
        return value.isoformat(sep='T')

    # If it's a date object
    if isinstance(value, date):
        return value.isoformat()

    # If it's a string, try to clean it up
    if isinstance(value, str):
        value = value.strip()

        # Case: "2023-07-23 09:00:00" -> "2023-07-23T09:00:00"
        if re.match(r"^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}", value):
            return value.replace(" ", "T")

        # Case: "2023-07-23" -> Keep as is
        if re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            return value

    return value

def process_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading {filepath.name}: {e}")
        return False

    # Split Frontmatter
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if not match:
        return False

    frontmatter_raw = match.group(1)
    markdown_body = match.group(2)

    try:
        data = yaml.safe_load(frontmatter_raw)
    except yaml.YAMLError as e:
        print(f"❌ YAML Error in {filepath.name}: {e}")
        return False

    changed = False

    # Check and fix specific fields
    for field in DATE_FIELDS:
        if field in data:
            original_value = data[field]
            new_value = fix_date_format(original_value)

            # If the value is None (was empty string), delete the field
            if new_value is None:
                del data[field]
                changed = True
                print(f"   Refining {filepath.name}: Removed empty '{field}'")
            # If value changed (e.g. replaced space with T), update it
            elif new_value != original_value:
                data[field] = new_value
                changed = True
                print(f"   Refining {filepath.name}: Fixed '{field}' format")

    if changed:
        # Write back to file
        yaml_output = yaml.dump(data, sort_keys=False, allow_unicode=True)
        final_content = f"---\n{yaml_output}---\n{markdown_body}"

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(final_content)
        return True

    return False

# ================= MAIN EXECUTION =================
if __name__ == "__main__":
    print(f"🚀 Starting Date Fixer...")
    print(f"   Target: {TARGET_DIR}\n")

    if not TARGET_DIR.exists():
        print(f"❌ Directory not found: {TARGET_DIR}")
        exit(1)

    count = 0
    modified_count = 0

    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".mdx"):
                full_path = Path(root) / file
                count += 1
                if process_file(full_path):
                    modified_count += 1

    print(f"\n✨ Completed! Scanned {count} files. Updated {modified_count} files.")
