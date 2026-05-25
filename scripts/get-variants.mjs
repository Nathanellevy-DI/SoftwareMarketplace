import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function checkVariants() {
  const token = process.env.PRINTFUL_API_KEY
  const storeId = '17922954'
  const productId = '425453429'
  
  try {
    const res = await fetch(`https://api.printful.com/store/products/${productId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-PF-Store-Id': storeId
      }
    })
    
    const data = await res.json()
    console.log("=== Product Variants ===")
    
    if (data.result && data.result.sync_variants) {
      data.result.sync_variants.slice(0, 5).forEach((v, i) => {
        console.log(`[${i+1}] Sync Variant ID: ${v.id}`)
        console.log(`    Name: ${v.name}`)
        console.log(`    Retail Price (Printful): $${v.retail_price}`)
      })
      console.log(`... and ${data.result.sync_variants.length - 5} more variants.`)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

checkVariants()
