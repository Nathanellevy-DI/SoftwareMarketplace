import { loginAction } from '@/app/admin/auth-actions'

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  const hasError = params?.error === '1'

  return (
    <main className="min-h-screen bg-[#F5EBE0] flex items-center justify-center p-4 selection:bg-[#D5BDAF] selection:text-[#2b2522]">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#2b2522]">
            Software MP
          </h1>
          <p className="text-xs uppercase tracking-[0.35em] text-[#6e625c] mt-2">
            Restricted Access
          </p>
        </div>

        <form action={loginAction} className="glass-panel bg-[#EDEDE9]/70 border border-[#2b2522]/10 p-8 rounded-2xl shadow-xl">
          {hasError && (
            <div className="border border-red-300 text-red-700 text-xs uppercase tracking-widest text-center py-3 mb-6 bg-red-50/50">
              Invalid Password
            </div>
          )}

          <div className="flex flex-col gap-2 mb-8">
            <label className="text-[#2b2522] text-xs uppercase tracking-widest font-bold">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="bg-transparent border-b border-[#2b2522]/20 text-[#2b2522] p-3 outline-none focus:border-[#2b2522] transition-colors text-lg tracking-wider placeholder:text-[#6e625c]/30"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full btn-neon font-black uppercase tracking-widest py-4 rounded-xl text-sm transition-all"
          >
            Enter Dashboard
          </button>
        </form>

        <p className="text-center text-[#6e625c]/60 text-[10px] mt-6 uppercase tracking-widest font-bold">
          Authorized Personnel Only
        </p>
      </div>
    </main>
  )
}
