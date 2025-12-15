import os
import re
import yaml
from datetime import datetime
from pathlib import Path

# ================= CONFIGURATION =================
# Resolve paths relative to this script file
# We assume this script is located in /scripts, so we go up one level to find the root
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Path to your old Hugo content directory
SOURCE_DIR = PROJECT_ROOT / "content/english/events"

# Path to your new Astro content directory
DEST_DIR = PROJECT_ROOT / "src/content/events"
# =================================================

def ensure_directory(path):
    Path(path).mkdir(parents=True, exist_ok=True)

def fix_url(url):
    """Ensures URLs start with a slash if they are local paths."""
    if not url or not isinstance(url, str):
        return None

    url = url.strip()
    if not url:
        return None

    if url.startswith("http") or url.startswith("https"):
        return url

    # Remove 'static/' prefix if it exists (common in Hugo)
    if url.startswith("static/"):
        url = url[7:]

    # Ensure leading slash
    if not url.startswith("/"):
        return "/" + url

    return url

def fix_boolean(value):
    """Converts 'Yes'/'No'/'True' strings to actual Booleans."""
    if isinstance(value, bool):
        return value

    if not value:
        return False

    s = str(value).lower().strip().strip("'").strip('"')
    return s in ["yes", "true", "y", "on"]

def parse_date(date_obj):
    """Parses various date formats into a standard datetime object."""
    if not date_obj:
        return None

    if isinstance(date_obj, datetime):
        return date_obj

    if isinstance(date_obj, str):
        date_obj = date_obj.strip()
        if not date_obj:
            return None
        try:
            # Try ISO format first (2023-07-23T09:00:00)
            return datetime.fromisoformat(date_obj.replace("Z", "+00:00"))
        except ValueError:
            try:
                # Try simple date (2023-07-23)
                return datetime.strptime(date_obj, "%Y-%m-%d")
            except ValueError:
                try:
                    # Try space separated (2023-07-23 09:00:00)
                    return datetime.strptime(date_obj, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    return None
    return None

def process_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
        return

    # Regex to split Frontmatter (YAML) from Content
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if not match:
        print(f"⚠️  Skipping {filepath.name}: No frontmatter found.")
        return

    frontmatter_raw = match.group(1)
    markdown_body = match.group(2)

    try:
        data = yaml.safe_load(frontmatter_raw)
    except yaml.YAMLError as e:
        print(f"❌ Error parsing YAML in {filepath.name}: {e}")
        return

    # --- MAPPING LOGIC ---
    new_data = {}

    # 1. Strings
    new_data["title"] = data.get("title", "Untitled Event")
    new_data["summary"] = data.get("description", "")
    new_data["draft"] = data.get("draft", False)
    new_data["location"] = data.get("location", "TBA")

    # Handle Gate Fee (ensure it's a string)
    gate_fee = data.get("gate_fee")
    if gate_fee:
        new_data["gateFee"] = str(gate_fee)

    # 2. Dates
    event_date = parse_date(data.get("event_datetime"))
    if event_date:
        new_data["date"] = event_date.strftime("%Y-%m-%d")
        year = event_date.year
    else:
        # Fallback year if no date found
        year = "misc"

    key_time = parse_date(data.get("key_time"))
    if key_time:
        new_data["keyTime"] = key_time.isoformat()

    check_in = parse_date(data.get("check_in_time"))
    if check_in:
        new_data["checkInTime"] = check_in.isoformat()

    # 3. Taxonomy / Enums
    if "club" in data:
        # Ensure it's a list
        clubs = data["club"]
        if isinstance(clubs, str):
            clubs = [clubs]
        new_data["hostingClubs"] = clubs

    if "event_type" in data:
        etype = data["event_type"]
        if etype.lower() == "fastkidz": etype = "FastKIDZ" # Fix capitalization
        new_data["eventType"] = etype

    new_data["format"] = data.get("event_format")
    new_data["series"] = data.get("event_series")

    # 4. Booleans (Fixing 'Yes'/'No')
    new_data["closedCourse"] = fix_boolean(data.get("closed_course", False))
    new_data["gasAway"] = fix_boolean(data.get("gas_away", False))

    # 5. Media & Links (Fixing URLs)
    new_data["image"] = fix_url(data.get("preview_image"))
    new_data["flyer"] = fix_url(data.get("flyer"))
    new_data["registrationLink"] = data.get("registration_url") or None
    new_data["startGridLink"] = data.get("start_grid") or None

    # 6. Downloads (Transform 'attachments' object to list)
    attachments = data.get("attachments")
    if attachments:
        downloads = []

        # Handle Dictionary format (attachment1: {...}, attachment2: {...})
        if isinstance(attachments, dict):
            for key, item in attachments.items():
                if item and isinstance(item, dict) and "filepath" in item:
                    downloads.append({
                        "label": item.get("label", "Download"),
                        "url": fix_url(item["filepath"])
                    })

        # Handle List format ([{label:..., filepath:...}])
        elif isinstance(attachments, list):
             for item in attachments:
                if item and isinstance(item, dict) and "filepath" in item:
                    downloads.append({
                        "label": item.get("label", "Download"),
                        "url": fix_url(item["filepath"])
                    })

        if downloads:
            new_data["downloads"] = downloads

    # --- WRITING FILE ---

    # Determine destination directory
    dest_year_dir = DEST_DIR / str(year)
    ensure_directory(dest_year_dir)

    # Clean up filename (keep original name)
    filename = filepath.name
    new_filepath = dest_year_dir / filename

    # Convert back to YAML
    # allow_unicode keeps special characters, sort_keys makes it readable
    yaml_output = yaml.dump(new_data, sort_keys=False, allow_unicode=True)

    # Construct final file content
    final_content = f"---\n{yaml_output}---\n{markdown_body}"

    with open(new_filepath, "w", encoding="utf-8") as f:
        f.write(final_content)

    print(f"✅ Converted: {filename} -> {new_filepath}")
    return 1

# ================= MAIN EXECUTION =================
if __name__ == "__main__":
    print(f"🚀 Starting Event Migration...")
    print(f"   Source: {SOURCE_DIR}")
    print(f"   Dest:   {DEST_DIR}\n")

    if not SOURCE_DIR.exists():
        print(f"❌ Source directory not found: {SOURCE_DIR}")
        exit(1)

    count = 0
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.endswith(".md") and not file.startswith("_index"):
                # Pass the full Path object
                full_path = Path(root) / file
                if process_file(full_path):
                    count += 1

    print(f"\n✨ Migration Complete! Processed {count} files.")
