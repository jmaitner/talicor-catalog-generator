"""
Run this script whenever the source spreadsheet changes.
Usage: python scripts/convert_xlsx.py "path/to/spreadsheet.xlsx"
Output: public/data/products.json
"""
import sys, json, math
from pathlib import Path
import pandas as pd

XLSX = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\jackson.maitner\Downloads\Jackson- Talicor Sheet.xlsx"
OUT = Path(__file__).parent.parent / "public" / "data" / "products.json"

df = pd.read_excel(XLSX, sheet_name="Product Information", header=3)
data = df.dropna(subset=["Vendor Item Number"])
data = data[~data["Vendor Item Number"].isin(["REQUIRED", "DS386"])]

def clean(val):
    if val is None: return None
    if isinstance(val, float) and math.isnan(val): return None
    return val

products = []
for _, row in data.iterrows():
    tags_raw = clean(row.get("Tags"))
    tags = [t.strip() for t in str(tags_raw).split(";") if t.strip()] if tags_raw else []
    image_urls = []
    for i in range(1, 6):
        url = clean(row.get(f"Image URL #{i}"))
        if url and str(url).startswith("http") and "companyname" not in str(url):
            image_urls.append(str(url))
    bullet_points = []
    for i in range(1, 6):
        bp = clean(row.get(f"Bullet Point #{i}"))
        if bp and str(bp).strip():
            bullet_points.append(str(bp).strip())
    products.append({
        "id": str(clean(row.get("Vendor Item Number")) or ""),
        "brand": str(clean(row.get("Brand Name")) or ""),
        "name": str(clean(row.get("Product Name")) or ""),
        "msrp": float(clean(row.get("MSRP"))) if clean(row.get("MSRP")) is not None else None,
        "wholesale_cost": float(clean(row.get("Regular Line/Wholesale Cost"))) if clean(row.get("Regular Line/Wholesale Cost")) is not None else None,
        "upc": str(clean(row.get("Numerical Product ID")) or ""),
        "description": str(clean(row.get("Product Description")) or "") or None,
        "tags": tags,
        "bullet_points": bullet_points,
        "primary_color": str(clean(row.get("Primary Color")) or "") or None,
        "min_age": int(clean(row.get("Minimum Age"))) if clean(row.get("Minimum Age")) is not None else None,
        "max_age": int(clean(row.get("Maximum Age"))) if clean(row.get("Maximum Age")) is not None else None,
        "gender": str(clean(row.get("Gender")) or "") or None,
        "material": str(clean(row.get("Material")) or "") or None,
        "whats_in_box": str(clean(row.get("What's in the Box")) or "") or None,
        "image_urls": image_urls,
    })

OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
print(f"Wrote {len(products)} products to {OUT}")
