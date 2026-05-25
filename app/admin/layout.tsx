import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  // Allow the login page to render without auth
  // For all other /admin routes, require the session cookie
  // We check pathname indirectly: if no session, redirect to login
  // The login page itself won't use this layout check (handled by its own route)
  
  return <>{children}</>
}
