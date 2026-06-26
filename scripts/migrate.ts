import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { products } from '../src/data/products';
import { blogs } from '../src/data/blogs';

// Manually read .env.local to avoid requiring dotenv dependency for this one-off script
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf-8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const uploadImage = async (localPath: string, bucket: string, fileName: string): Promise<string | null> => {
  try {
    const fullPath = path.resolve(process.cwd(), 'public', localPath.replace(/^\//, ''));
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    // get mime type roughly
    let contentType = 'image/jpeg';
    if (fileName.endsWith('.png')) contentType = 'image/png';
    else if (fileName.endsWith('.svg')) contentType = 'image/svg+xml';
    
    // We append a timestamp to ensure uniqueness or just use the name
    const filePath = `${Date.now()}_${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrlData.publicUrl;

  } catch (err) {
    console.error(`Error processing image ${localPath}:`, err);
    return null;
  }
};

async function migrateProducts() {
  console.log('Migrating products...');
  for (const product of products) {
    let imageUrl = null;
    if (product.image) {
      const fileName = path.basename(product.image);
      imageUrl = await uploadImage(product.image, 'products', fileName);
    }

    const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    let originalPriceNum = null;
    if (product.originalPrice) {
      originalPriceNum = parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''));
    }

    const { data, error } = await supabase.from('products').insert({
      name: product.name,
      category: product.category,
      price: priceNum,
      original_price: originalPriceNum,
      image_url: imageUrl,
      is_new: product.isNew || false,
      is_sale: product.isSale || false,
      is_premium: product.isPremium || false,
      stock_quantity: 10 // default
    });

    if (error) {
      console.error(`Error inserting product ${product.name}:`, error.message);
    } else {
      console.log(`Inserted product: ${product.name}`);
    }
  }
}

async function migrateBlogs() {
  console.log('Migrating blogs...');
  for (const blog of blogs) {
    let imageUrl = null;
    if (blog.coverImage) {
      const fileName = path.basename(blog.coverImage);
      imageUrl = await uploadImage(blog.coverImage, 'blogs', fileName);
    }

    const { data, error } = await supabase.from('blogs').insert({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image_url: imageUrl,
      author_name: blog.author,
      tags: blog.tags
    });

    if (error) {
      console.error(`Error inserting blog ${blog.slug}:`, error.message);
    } else {
      console.log(`Inserted blog: ${blog.slug}`);
    }
  }
}

async function main() {
  await migrateProducts();
  await migrateBlogs();
  console.log('Migration completed!');
}

main().catch(console.error);
