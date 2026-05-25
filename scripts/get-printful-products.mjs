import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function fetchProducts() {
  const token = process.env.PRINTFUL_API_KEY
  
  try {
    const res = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await res.json()
    console.log("=== Printful Sync Products ===")
    console.log(JSON.stringify(data, null, 2))
    
    if (data.result && data.result.length > 0) {
      console.log("\nFetching details for the first product...")
      const detailRes = await fetch(`https://api.printful.com/store/products/${data.result[0].id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const detailData = await detailRes.json()
      console.log("=== Product Details ===")
      console.log(JSON.stringify(detailData, null, 2))
    }
    
  } catch (err) {
    console.error('Error fetching from Printful:', err)
  }
}

fetchProducts()
