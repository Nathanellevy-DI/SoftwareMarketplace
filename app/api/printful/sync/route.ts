import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60 // Vercel hobby timeout is lower, but we try 60s

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const token = process.env.PRINTFUL_API_KEY
    if (!token) return NextResponse.json({ error: 'Missing Integration Token' }, { status: 400 })

    // 1. Get User's First Store
    const storeRes = await fetch('https://api.printful.com/stores', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const storeData = await storeRes.json()
    if (!storeData.result || storeData.result.length === 0) {
      return NextResponse.json({ error: 'No manual API store found in Printful.' }, { status: 404 })
    }
    const storeId = storeData.result[0].id

    // 2. Fetch all Sync Products from Printful Store
    const prodsRes = await fetch('https://api.printful.com/store/products', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-PF-Store-Id': storeId.toString()
      }
    })
    const prodsData = await prodsRes.json()
    const printfulProducts = prodsData.result || []

    const { data: uncat } = await supabase.from('categories').select('id').eq('name', 'Uncategorized').maybeSingle()
    const uncategorizedId = uncat?.id || null

    let importedCount = 0

    // 3. Loop through and Sync each Product
    for (const pfProd of printfulProducts) {
      // Check if product already exists locally by Title (to avoid duplicates if they added it manually prior)
      const { data: existingProd } = await supabase
        .from('products')
        .select('id')
        .eq('title', pfProd.name)
        .maybeSingle()

      let dbProductId = existingProd?.id

      if (dbProductId) {
        // Strict Isolation: User explicitly demanded that existing configured listings are NEVER touched by the Sync script.
        // Bypassing immediately to preserve all custom variants, images, and differential prices!
        continue
      }
      
      const isNewProduct = !dbProductId

      if (!dbProductId) {
        // Create Product
        const { data: newProd, error: insertErr } = await supabase
          .from('products')
          .insert({
            title: pfProd.name,
            image_urls: [pfProd.thumbnail_url],
            image_url: pfProd.thumbnail_url, // Legacy fallback to satisfy DB NOT NULL constraint
            price: 50.00, // Temp placeholder
            category_id: uncategorizedId
          })
          .select('id')
          .single()

        if (insertErr) {
          console.error("Error inserting product:", insertErr)
          continue
        }
        dbProductId = newProd.id
        importedCount++
      }

      // Fetch Sub-Variants from Printful
      const varRes = await fetch(`https://api.printful.com/store/products/${pfProd.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-PF-Store-Id': storeId.toString()
        }
      })
      const varData = await varRes.json()
      const syncVariants = varData.result?.sync_variants || []

      // Wipe exact existing sizes so they perfectly match Printful's latest dimensions
      await supabase.from('product_variants').delete().eq('product_id', dbProductId)

      let lowestPrice = 99999
      const allMockups = new Set<string>()
      allMockups.add(pfProd.thumbnail_url)

      const variantInserts = syncVariants.map((v: any) => {
        const floatPrice = parseFloat(v.retail_price) || 0
        if (floatPrice < lowestPrice && floatPrice > 0) lowestPrice = floatPrice
        
        // Harvest any unique mockup imagery attached to this specific size
        if (Array.isArray(v.files)) {
          v.files.forEach((f: any) => {
            if (f.type === 'preview' && f.preview_url) {
              allMockups.add(f.preview_url)
            }
          })
        }

        return {
          product_id: dbProductId,
          size_name: v.name.replace(`${pfProd.name} - `, '').replace(`${pfProd.name} / `, ''),
          price: floatPrice,
          printful_sync_variant_id: v.id.toString()
        }
      })

      if (variantInserts.length > 0) {
        await supabase.from('product_variants').insert(variantInserts)

        // As existing items are aggressively skipped at the top of the loop, 
        // this block is absolutely guaranteed to only fire on brand new items.
        await supabase.from('products').update({ 
          price: lowestPrice,
          image_urls: Array.from(allMockups)
        }).eq('id', dbProductId)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${importedCount} new items & all variations from Printful!` 
    })

  } catch (err: any) {
    console.error('Printful Auto-Sync Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
