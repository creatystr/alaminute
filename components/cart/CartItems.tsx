'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { SIZE_OPTIONS, FRAME_OPTIONS, GLASS_OPTIONS } from '@/types'

export function CartItems() {
  const { items, updateQuantity, removeItem } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Sepetiniz boş</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const size = SIZE_OPTIONS.find(s => s.id === item.size)
        const frame = FRAME_OPTIONS.find(f => f.id === item.frame)
        const glass = GLASS_OPTIONS.find(g => g.id === item.glass)

        return (
          <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg border">
            {/* Image */}
            <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Görsel yok
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.productName}</h3>
              <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                <p>Boyut: {size?.label}</p>
                <p>Çerçeve: {frame?.label}</p>
                {item.frame !== 'no-frame' && (
                  <>
                    <p>Cam: {glass?.label}</p>
                    <p>Paspartu: {item.passepartout === 'none' ? 'Yok' : item.passepartout}</p>
                  </>
                )}
              </div>

              {/* Quantity & Remove */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-500">({formatPrice(item.price)} / adet)</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
