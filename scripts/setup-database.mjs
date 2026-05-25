import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const conString = process.env.DATABASE_URL

async function run() {
  console.log("⚡ Setting up fresh database schema...")
  const client = new pg.Client({ connectionString: conString })
  
  try {
    await client.connect()
    console.log("✅ Connected to new Supabase database")

    // 1. Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    console.log("  ✓ UUID extension enabled")

    // 2. Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log("  ✓ categories table created")

    // 3. Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        image_url TEXT,
        image_urls TEXT[] DEFAULT '{}',
        tech_stack TEXT[] DEFAULT '{}',
        github_url TEXT,
        demo_url TEXT,
        download_url TEXT,
        features TEXT[] DEFAULT '{}',
        is_available BOOLEAN DEFAULT true,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log("  ✓ products table created")

    // 4. Create product_variants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        size_name TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        printful_variant_id TEXT,
        license_details TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log("  ✓ product_variants table created")

    // 5. Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_email TEXT NOT NULL,
        customer_name TEXT,
        shipping_address TEXT,
        phone_number TEXT,
        shipping_speed TEXT,
        total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        tracking_number TEXT,
        license_key TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log("  ✓ orders table created")

    // 6. Create order_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
        quantity INT NOT NULL DEFAULT 1,
        price_at_purchase NUMERIC(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log("  ✓ order_items table created")

    // 7. Insert default category
    await client.query(`
      INSERT INTO categories (name) VALUES ('Uncategorized')
      ON CONFLICT (name) DO NOTHING;
    `)
    console.log("  ✓ Default 'Uncategorized' category added")

    // 8. Create storage bucket for product images (via Supabase API)
    console.log("\n🎉 Database schema setup complete!")
    console.log("📝 Don't forget to create a 'product-images' storage bucket in your Supabase dashboard")
    console.log("   → Go to Storage → New Bucket → Name: 'product-images' → Public bucket: ON")

  } catch (error) {
    console.error("❌ Error:", error.message)
  } finally {
    await client.end()
  }
}

run()
