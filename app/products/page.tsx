import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/product/ProductCard'
import { connectDB } from '@/lib/db'
import ProductModel from '@/models/Product'
import { Product } from '@/types'

interface PageProps {
  searchParams: Promise<{ 
    category?: string
    new?: string
    sort?: string
  }>
}

async function getProducts(filters: {
  category?: string
  isNew?: boolean
  sort?: string
}): Promise<Product[]> {
  await connectDB()
  
  const query: Record<string, unknown> = { isActive: true }
  
  if (filters.category) {
    query.category = filters.category
  }
  if (filters.isNew) {
    query.isNew = true
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
  if (filters.sort === 'price-asc') sortOption = { basePrice: 1 }
  if (filters.sort === 'price-desc') sortOption = { basePrice: -1 }
  if (filters.sort === 'name') sortOption = { name: 1 }

  const products = await ProductModel.find(query)
    .sort(sortOption)
    .limit(50)
    .lean()
  
  return JSON.parse(JSON.stringify(products)) as Product[]
}

export const metadata = {
  title: 'Tüm Ürünler | alaminute',
  description: 'Çerçeveli posterler ve sanat eserleri koleksiyonumuzu keşfedin.',
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const products = await getProducts({
    category: params.category,
    isNew: params.new === 'true',
    sort: params.sort,
  })

  const categoryLabels: Record<string, string> = {
    poster: 'Posterler',
    art: 'Sanat Eserleri',
    photo: 'Fotoğraflar',
    print: 'Baskılar',
  }

  const pageTitle = params.category 
    ? categoryLabels[params.category] || 'Ürünler'
    : params.new === 'true'
    ? 'Yeni Gelenler'
    : 'Tüm Ürünler'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-500 mt-1">{products.length} ürün</p>
            </div>
            
            {/* Sort */}
            <select 
              className="border rounded-lg px-4 py-2 text-sm bg-white"
              defaultValue={params.sort || 'newest'}
            >
              <option value="newest">En Yeni</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name">İsim</option>
            </select>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
