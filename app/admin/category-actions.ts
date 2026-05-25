'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(name: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('categories')
      .insert({ name })
    
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to create category:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to delete category:', err)
    return { success: false, error: err.message }
  }
}

export async function renameCategory(id: string, newName: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id)
      
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to rename category:', err)
    return { success: false, error: err.message }
  }
}
