const fs = require('fs');
const path = require('path');

const files = [
  "src/app/admin/blogs/page.tsx",
  "src/app/admin/blogs/[id]/edit/page.tsx",
  "src/app/admin/customers/page.tsx",
  "src/app/admin/customers/[id]/page.tsx",
  "src/app/admin/customizations/page.tsx",
  "src/app/admin/orders/page.tsx",
  "src/app/admin/products/page.tsx",
  "src/app/admin/products/[id]/edit/page.tsx",
  "src/app/admin/shipments/page.tsx"
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace imports
  content = content.replace(/import\s+{\s*createServerClient\s*}\s+from\s+"@supabase\/ssr";\s*\r?\n/, '');
  content = content.replace(/import\s+{\s*cookies\s*}\s+from\s+"next\/headers";\s*\r?\n/, '');

  if (!content.includes('import { createClient } from "@/utils/supabase/server";')) {
      content = 'import { createClient } from "@/utils/supabase/server";\n' + content;
  }

  // Replace instantiation block
  const pattern = /const\s+cookieStore\s*=\s*await\s+cookies\(\);\s*\r?\n\s*const\s+supabase\s*=\s*createServerClient\(\s*\r?\n\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*\r?\n\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\s*\r?\n\s*\{\s*\r?\n\s*cookies:\s*\{\s*\r?\n\s*getAll\(\)\s*\{\s*\r?\n\s*return\s+cookieStore\.getAll\(\);\s*\r?\n\s*\},\s*\r?\n\s*\},\s*\r?\n\s*\}\s*\r?\n\s*\);/m;

  content = content.replace(pattern, "const supabase = await createClient();");
  
  // Try fallback pattern if there are minor whitespace differences
  const pattern2 = /const\s+cookieStore\s*=\s*await\s+cookies\(\);\s*const\s+supabase\s*=\s*createServerClient\([\s\S]*?\}\s*\);\s*/m;
  content = content.replace(pattern2, "const supabase = await createClient();\n  ");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', file);
}
