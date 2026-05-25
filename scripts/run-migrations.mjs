import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const conString = process.env.DATABASE_URL || "postgresql://postgres:Cpxkjkaz5Nigl8CM@db.czdhymqvepshaysyyoed.supabase.co:5432/postgres"

async function run() {
  console.log("⚡ Starting Live Database Schema Migration...")
  const client = new pg.Client({ connectionString: conString })
  
  try {
    await client.connect()
    console.log("🚀 Connected to PostgreSQL database.")

    // 1. Alter Products Table
    console.log("📐 Updating products table schema...")
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[];")
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}';")
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS github_url TEXT;")
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS demo_url TEXT;")
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS download_url TEXT;")
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';")
    console.log("✅ Products table updated.")

    // 2. Alter Product Variants Table
    console.log("📐 Updating product_variants table schema...")
    await client.query("ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS license_details TEXT[] DEFAULT '{}';")
    console.log("✅ Product variants table updated.")

    // 3. Alter Orders Table
    console.log("📐 Updating orders table schema...")
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS license_key TEXT;")
    // Drop shipping fields if they exist
    try {
      await client.query("ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address;")
      await client.query("ALTER TABLE orders DROP COLUMN IF EXISTS phone_number;")
      await client.query("ALTER TABLE orders DROP COLUMN IF EXISTS shipping_speed;")
    } catch (e) {
      console.log("⚠️ Note: shipping columns drop skipped or handled.");
    }
    console.log("✅ Orders table updated.")

    console.log("🎉 Live Database Schema Migrations Completed Successfully!")
  } catch (error) {
    console.error("💥 Error during migrations execution:", error)
  } finally {
    await client.end()
    console.log("🔌 Database connection closed.")
  }
}

run()
