import re

html_path = r'C:\Users\Karan\.gemini\antigravity-ide\brain\b67ad9a9-f411-4a05-983b-a8b5516026ee\.system_generated\steps\781\content.md'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Try to find woocommerce product titles
titles = re.findall(r'<h2 class="woocommerce-loop-product__title">(.*?)</h2>', html)
if not titles:
    # Try generic title finding inside product links
    titles = re.findall(r'<a href="https://thetribetoy.com/product/.*?>(.*?)</a>', html, re.IGNORECASE)

print("Found titles via regex:", set(titles))

# More general regex for products
products = re.findall(r'href="(https://thetribetoy.com/product/[^"]+)"', html)
print("Product URLs:")
for p in set(products):
    print(p)
