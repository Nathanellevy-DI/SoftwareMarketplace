import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function diagnose() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  )

  console.log("--- Diagnosing Products Table ---")
  const { data: products, error: pError } = await supabase.from('products').select('id, title, image_url')
  if (pError) {
    console.error("Failed to fetch products:", pError)
  } else {
    console.log(`Found ${products.length} products.`)
    products.forEach(p => {
      const isBase64 = p.image_url.startsWith('data:')
      console.log(`- [${p.id}] ${p.title} (Image uses Base64: ${isBase64}, Length: ${(p.image_url.length / 1024).toFixed(1)} KB)`)
    })
  }

  console.log("\n--- Diagnosing Storage Bucket ---")
  const { data: files, error: fError } = await supabase.storage.from('product-images').list()
  if (fError) {
    console.error("Storage list error:", fError)
  } else {
    console.log(`Found ${files.length} files in 'product-images' bucket.`)
    files.forEach(f => {
      console.log(`- ${f.name} (${(f.metadata?.size / 1024).toFixed(1)} KB)`)
    })
  }
}

diagnose()
