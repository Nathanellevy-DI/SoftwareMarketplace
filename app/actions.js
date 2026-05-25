'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const price = parseFloat(formData.get('price'))
  const imageUrlsString = formData.get('imageUrls')
  const image_urls = imageUrlsString ? imageUrlsString.split(',') : []
  const category_id = formData.get('category_id') || null

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('products').insert({
      title,
      description,
      price,
      image_urls,
      category_id
    })

    if (error) throw error

    // This clears the cache so the new product shows up instantly
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: error.message || "Failed to add product" }
  }
}
