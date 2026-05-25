import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const { Client } = pkg

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  })

  try {
    await client.connect()

    console.log('Adding image_urls column to products table...')
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}'`)
    console.log('Successfully added image_urls column.')

    console.log('Migrating existing image_url data into image_urls array...')
    await client.query(`UPDATE products SET image_urls = ARRAY[image_url] WHERE image_url IS NOT NULL AND array_length(image_urls, 1) IS NULL`)
    console.log('Successfully migrated image_url data.')

    console.log('Migration Complete!')
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    await client.end()
    process.exit(0)
  }
}

main()
