import Link from 'next/link'

export const metadata = {
  title: "Contact Support | Software MP",
  description: "Get in touch with the Software MP developer studio for custom builds, self-hosting issues, or licensing assistance."
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] selection:bg-[#D5BDAF] selection:text-[#2b2522] pb-32">
      {/* Refined Navigation Header */}
      <div className="border-b border-[#2b2522]/10 bg-[#EDEDE9]/30">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#2b2522] transition-colors">
            ← Back to Catalog
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/track" className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#2b2522] transition-colors">
              Access Purchases
            </Link>
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                className="w-8 h-8 object-cover bg-[#2b2522] rounded-lg shadow-sm border border-[#2b2522]/10" 
                alt="Software MP Logo" 
              />
              <span className="text-xl font-black uppercase tracking-tight text-[#2b2522]">
                Software MP
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-24">
        {/* Header Block */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#2b2522] mb-6">
            Developer Support
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Need assistance setting up a self-hosted instance, requesting custom feature development, or recovering an existing purchase license key? We're here to help.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Custom Code Card */}
          <div className="glass-panel p-10 md:p-14 rounded-2xl border border-[#2b2522]/10 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-[#EDEDE9]/45">
            <div className="text-3xl mb-6">🛠</div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-[#2b2522] mb-4">Custom Code &amp; Builds</h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">
              Need custom integrations, private features, or Docker/Kubernetes deployment configurations for your team? Tell us your specifications and we can deliver custom private builds.
            </p>
            <a href="mailto:framesfocusprints@mail.ru?subject=Custom Software Build Inquiry" className="btn-neon inline-block text-center text-[10px] font-bold uppercase tracking-wider py-4 rounded-lg w-full">
              Request Custom Build
            </a>
          </div>

          {/* Licensing & Technical Support Card */}
          <div className="glass-panel p-10 md:p-14 rounded-2xl border border-[#2b2522]/10 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-[#EDEDE9]/45">
            <div className="text-3xl mb-6">🔑</div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-[#2b2522] mb-4">Licensing &amp; Setup</h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">
              Having trouble processing checkout, downloading secure binaries, activating license keys, or configuring environment setups? Our development team is available.
            </p>
            <a href="mailto:framesfocusprints@mail.ru?subject=Technical Setup Request" className="btn-warm-secondary inline-block text-center text-[10px] font-bold uppercase tracking-wider py-4 rounded-lg w-full">
              Open Support Ticket
            </a>
          </div>

        </div>

        {/* Direct Email Fallback */}
        <div className="mt-20 text-center border-t border-[#2b2522]/10 pt-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Direct Communication Line</p>
          <a href="mailto:framesfocusprints@mail.ru" className="text-xl font-bold tracking-tight text-[#2b2522] hover:underline decoration-2 underline-offset-8">
            framesfocusprints@mail.ru
          </a>
        </div>

      </div>
    </main>
  )
}
