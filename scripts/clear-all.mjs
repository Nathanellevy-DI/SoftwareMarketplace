import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const conString = process.env.DATABASE_URL || "postgresql://postgres:Cpxkjkaz5Nigl8CM@db.czdhymqvepshaysyyoed.supabase.co:5432/postgres"

async function run() {
  console.log("🧹 Clearing all products for a fresh start...")
  const client = new pg.Client({ connectionString: conString })
  
  try {
    await client.connect()
    console.log("✅ Connected to database")

    // Clear order items first (foreign key to products)
    const { rowCount: orderItems } = await client.query('DELETE FROM order_items')
    console.log(`  Deleted ${orderItems} order items`)

    // Clear orders
    const { rowCount: orders } = await client.query('DELETE FROM orders')
    console.log(`  Deleted ${orders} orders`)

    // Clear product variants
    const { rowCount: variants } = await client.query('DELETE FROM product_variants')
    console.log(`  Deleted ${variants} product variants`)

    // Clear products
    const { rowCount: products } = await client.query('DELETE FROM products')
    console.log(`  Deleted ${products} products`)

    console.log("\n🎉 Everything cleared! You can now add fresh products from the Admin dashboard.")
  } catch (err) {
    console.error("❌ Error:", err.message)
  } finally {
    await client.end()
  }
}

run()
