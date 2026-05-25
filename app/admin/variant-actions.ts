'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addVariant(productId: string, formData: FormData) {
  const size_name = formData.get('size_name') as string
  const price = parseFloat(formData.get('price') as string)
  const printful_sync_variant_id = formData.get('printful_sync_variant_id') as string

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('product_variants')
      .insert({
        product_id: productId,
        size_name,
        price,
        printful_sync_variant_id: printful_sync_variant_id || null
      })

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath(`/product/${productId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Add variant error:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteVariant(variantId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId)

    if (error) {
      if (error.code === '23503') {
        return { 
          success: false, 
          error: "Cannot delete this size because a customer has ordered it. It's preserved for historical records." 
        }
      }
      throw error
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Delete variant error:", error)
    return { success: false, error: error.message }
  }
}
