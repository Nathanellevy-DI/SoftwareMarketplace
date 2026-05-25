import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Auto-resize and optimize with sharp → WebP
    const optimized = await sharp(buffer)
      .resize(1200, 1600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Upload to Supabase Storage
    const supabase = await createClient()
    const fileName = `${crypto.randomUUID()}.webp`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, optimized, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (error) {
      console.error('Supabase Storage upload error:', error)
      
      // Fallback to base64 if storage bucket doesn't exist yet
      console.warn('⚠️ Falling back to base64 data URL. Create a "product-images" bucket in Supabase to use proper storage.')
      const base64 = optimized.toString('base64')
      const dataUrl = `data:image/webp;base64,${base64}`
      return NextResponse.json({ url: dataUrl })
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrlData.publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
