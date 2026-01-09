import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductConfigurator } from '@/components/product/ProductConfigurator'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import ProductModel from '@/models/Product'
import { Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  await connectDB()
  const product = await ProductModel.findOne({ slug, isActive: true }).lean()
  if (!product) return null
  return JSON.parse(JSON.stringify(product)) as Product
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return { title: 'Ürün Bulunamadı | alaminute' }
  }

  return {
    title: `${product.name} | alaminute`,
    description: product.description,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile: Stack vertically, Desktop: 2 columns */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Gallery */}
            <div className="mb-8 lg:mb-0">
              <ProductGallery images={product.images} name={product.name} />
            </div>
            
            {/* Product Info & Configurator */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">{product.artist}</p>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                {product.description && (
                  <p className="mt-4 text-gray-600">{product.description}</p>
                )}
              </div>
              
              <ProductConfigurator product={product} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
