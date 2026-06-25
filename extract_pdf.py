import fitz # PyMuPDF
import sys
import os

pdf_path = sys.argv[1]
output_dir = sys.argv[2]

doc = fitz.open(pdf_path)
for i in range(len(doc)):
    for img in doc.get_page_images(i):
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n - pix.alpha < 4:       # this is GRAY or RGB
            pix.save(os.path.join(output_dir, f"workshop_{i}.png"))
        else:               # CMYK: convert to RGB first
            pix1 = fitz.Pixmap(fitz.csRGB, pix)
            pix1.save(os.path.join(output_dir, f"workshop_{i}.png"))
            pix1 = None
        pix = None
print("Extraction complete.")
