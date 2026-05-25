import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://czdhymqvepshaysyyoed.supabase.co'
const supabaseKey = 'sb_publishable_CnrCzCT7KCF5Xs1WNflwXw_qwAbA9SB'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: products, error } = await supabase.from('products').select('id, title, created_at, image_url').order('created_at', { ascending: false })
  if (error) {
    console.error(error)
    process.exit(1)
  }
  console.log(`Found ${products.length} products:`)
  for (const p of products) {
    console.log(`- ${p.title} (${p.created_at})`)
    console.log(`  URL starts with: ${p.image_url ? p.image_url.substring(0, 50) : 'null'}`)
  }
  process.exit(0)
}

check().catch(console.error)

check().catch(console.error)
