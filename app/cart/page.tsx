import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartItems } from '@/components/cart/CartItems'
import { CartSummary } from '@/components/cart/CartSummary'

export const metadata = {
  title: 'Sepetim | alaminute',
  description: 'Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.',
}

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-8">Sepetim</h1>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartItems />
            </div>
            
            {/* Summary */}
            <div className="mt-8 lg:mt-0">
              <CartSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
