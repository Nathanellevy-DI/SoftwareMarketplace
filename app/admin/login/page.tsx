import { loginAction } from '@/app/admin/auth-actions'

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  const hasError = params?.error === '1'

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-white selection:text-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Frame &amp; Focus
          </h1>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mt-2">
            Restricted Access
          </p>
        </div>

        <form action={loginAction} className="border border-gray-800 p-8">
          {hasError && (
            <div className="border border-red-500 text-red-400 text-xs uppercase tracking-widest text-center py-3 mb-6">
              Invalid Password
            </div>
          )}

          <div className="flex flex-col gap-2 mb-8">
            <label className="text-white text-xs uppercase tracking-widest">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="bg-transparent border-b border-white text-white p-3 outline-none focus:border-gray-500 transition-colors text-lg tracking-wider"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-black uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors text-sm"
          >
            Enter Dashboard
          </button>
        </form>

        <p className="text-center text-gray-700 text-xs mt-6 uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </div>
    </main>
  )
}
