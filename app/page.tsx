import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-widest">
            ALAMINUTE
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/collections/minimalist" className="text-sm text-gray-600 hover:text-black">
              Minimalist
            </Link>
            <Link href="/collections/nature" className="text-sm text-gray-600 hover:text-black">
              Doğa
            </Link>
            <Link href="/collections/abstract" className="text-sm text-gray-600 hover:text-black">
              Soyut
            </Link>
            <Link href="/collections/typography" className="text-sm text-gray-600 hover:text-black">
              Tipografi
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm text-gray-600 hover:text-black">
              Sepet (0)
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-light tracking-tight mb-6">
          Evinize Sanat Katın
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Minimalist tasarımlar, kaliteli baskılar ve el yapımı çerçevelerle 
          mekanlarınıza karakter katın.
        </p>
        <Link 
          href="/collections/minimalist" 
          className="inline-block bg-black text-white px-8 py-3 text-sm tracking-wide hover:bg-gray-800 transition"
        >
          KOLEKSİYONU KEŞFET
        </Link>
      </section>

      {/* Featured Products Placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-light text-center mb-12">Öne Çıkanlar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  Ürün {i}
                </div>
              </div>
              <h3 className="text-sm font-medium">Ürün İsmi</h3>
              <p className="text-sm text-gray-500">₺299'dan başlayan</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Minimalist', 'Doğa', 'Soyut', 'Tipografi'].map((cat) => (
              <Link
                key={cat}
                href={`/collections/${cat.toLowerCase()}`}
                className="aspect-square bg-white flex items-center justify-center text-lg font-light hover:bg-black hover:text-white transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 Alaminute. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
