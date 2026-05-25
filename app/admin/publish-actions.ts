'use server'

import { revalidatePath } from 'next/cache'

export async function publishAllChanges() {
  try {
    revalidatePath('/')
    revalidatePath('/admin')
    
    // Simulate a slight delay so the user feels the "work" being done for maximum reassurance
    await new Promise(r => setTimeout(r, 800))
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
