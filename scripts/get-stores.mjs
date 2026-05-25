import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function checkStores() {
  const token = process.env.PRINTFUL_API_KEY
  
  try {
    const res = await fetch('https://api.printful.com/stores', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const data = await res.json()
    console.log("=== Printful Stores ===")
    console.log(JSON.stringify(data.result, null, 2))
    
    if (data.result && data.result.length > 0) {
      const storeId = data.result[0].id
      console.log(`\nFetching products for Store ID: ${storeId}...`)
      
      const prodRes = await fetch('https://api.printful.com/store/products', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-PF-Store-Id': storeId.toString()
        }
      })
      const prodData = await prodRes.json()
      console.log("=== Sync Products ===")
      console.log(JSON.stringify(prodData.result, null, 2))
    } else {
      console.log("\n❌ NO STORES FOUND! The user has not created a Manual/API store yet.")
    }
    
  } catch (err) {
    console.error('Error:', err)
  }
}

checkStores()
