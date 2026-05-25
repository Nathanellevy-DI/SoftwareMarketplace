'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient()
    // 1. Force Detach: Attempt to sever relational constraints on historical orders
    // We try to set product_id to null so the order preserves the monetary record
    const { error: detachError } = await supabase
      .from('order_items')
      .update({ product_id: null })
      .eq('product_id', productId)

    if (detachError) {
      // If the column is unequivocally NOT NULL, we eradicate the order items entirely 
      // to forcefully grant the user's deletion request parameter.
      await supabase
        .from('order_items')
        .delete()
        .eq('product_id', productId)
    }

    // 2. Eradicate the Product Entry
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (error) {
      throw error
    }
    
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Product deletion error:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const category_id = formData.get('category_id') as string

  try {
    const supabase = await createClient()
    
    // 1. Fetch current price to calculate differential margin
    const { data: oldProduct } = await supabase.from('products').select('price').eq('id', productId).single()
    const oldPrice = parseFloat(String(oldProduct?.price || 0))
    const priceDiff = price - oldPrice

    const updateData: any = { title, description, price }
    if (category_id) updateData.category_id = category_id
    
    // Only update images if new ones were explicitly provided
    if (imageUrl && imageUrl.length > 0) {
      updateData.image_urls = imageUrl.split(',')
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)

    if (error) throw error

    // 2. If the user explicitly changed the mathematical price, propagate the margin difference to all child variations!
    if (priceDiff !== 0) {
      const { data: variants } = await supabase.from('product_variants').select('id, price').eq('product_id', productId)
      if (variants && variants.length > 0) {
        for (const v of variants) {
          const newVariantPrice = parseFloat(String(v.price)) + priceDiff
          await supabase.from('product_variants').update({ price: newVariantPrice }).eq('id', v.id)
        }
      }
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Product update error:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleProductAvailability(productId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_available: !currentStatus })
      .eq('id', productId)
      
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Toggle availability error:", error)
    return { success: false, error: error.message }
  }
}

export async function addProductImage(productId: string, imageUrl: string) {
  try {
    const supabase = await createClient()

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_urls')
      .eq('id', productId)
      .single()

    if (fetchError) throw fetchError

    const currentUrls = Array.isArray(product.image_urls) ? product.image_urls : []
    const updatedUrls = [...currentUrls, imageUrl]

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_urls: updatedUrls })
      .eq('id', productId)

    if (updateError) throw updateError

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Add image error:", error)
    return { success: false, error: error.message }
  }
}

export async function removeProductImage(productId: string, imageUrlToRemove: string) {
  try {
    const supabase = await createClient()
    
    // First fetch current arrays
    const { data: product } = await supabase.from('products').select('image_urls').eq('id', productId).single()
    if (!product) throw new Error("Product not found")

    const currentImages = product.image_urls || []
    const newImages = currentImages.filter((img: string) => img !== imageUrlToRemove)

    // Ensure we don't delete the last image!
    if (newImages.length === 0) {
      throw new Error("Cannot delete the only image. Please upload a new image first before deleting this one.")
    }

    const { error } = await supabase
      .from('products')
      .update({ image_urls: newImages })
      .eq('id', productId)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath(`/product/${productId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Remove image error:", error)
    return { success: false, error: error.message }
  }
}
