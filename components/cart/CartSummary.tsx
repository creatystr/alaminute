'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export function CartSummary() {
  const items = useCartStore((state) => state.items)
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 49.90 // Ücretsiz kargo 500 TL üzeri
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Ara Toplam</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Kargo</span>
          {shipping === 0 ? (
            <span className="text-green-600">Ücretsiz</span>
          ) : (
            <span>{formatPrice(shipping)}</span>
          )}
        </div>
        
        {shipping > 0 && (
          <p className="text-xs text-gray-500">
            500 TL üzeri alışverişlerde kargo ücretsiz!
          </p>
        )}
        
        <div className="border-t pt-3 flex justify-between font-semibold text-base">
          <span>Toplam</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 w-full block text-center py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Ödemeye Geç
      </Link>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Güvenli ödeme ile alışverişinizi tamamlayın
      </p>
    </div>
  )
}
