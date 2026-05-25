import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function checkPrintful() {
  const token = process.env.PRINTFUL_API_KEY
  console.log("Checking Printful token...", token ? "Found" : "Missing")
  
  try {
    const res = await fetch('https://api.printful.com/stores', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await res.json()
    console.log("Response:", JSON.stringify(data, null, 2))
    
    if (res.ok) {
      console.log('✅ Printful connection successful!')
    } else {
      console.log('❌ Printful connection failed.')
    }
  } catch (err) {
    console.error('Error connecting to Printful:', err)
  }
}

checkPrintful()
