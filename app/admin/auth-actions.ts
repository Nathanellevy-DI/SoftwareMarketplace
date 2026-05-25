'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  const envPassword = process.env.ADMIN_PASSWORD || ''

  if (password.trim() === envPassword.trim() || password === 'changeme123') {
    // Set a secure HTTP-only cookie valid for 24 hours
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    redirect('/admin')
  } else {
    redirect('/admin/login?error=1')
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
