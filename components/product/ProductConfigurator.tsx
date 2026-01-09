'use client'

import { useState, useMemo } from 'react'
import { SIZE_OPTIONS, FRAME_OPTIONS, GLASS_OPTIONS, PassepartoutOption, Product, CartItem } from '@/types'
import { calculatePrice } from '@/lib/pricing'
import { formatPrice, generateCartItemId } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { Check, ShoppingCart } from 'lucide-react'

interface ProductConfiguratorProps {
  product: Product
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  
  const [config, setConfig] = useState({
    size: product.availableSizes[0] || '30x40',
    frame: product.availableFrames[0] || 'no-frame',
    glass: 'no-glass' as 'no-glass' | 'normal' | 'museum',
    passepartout: 'none' as PassepartoutOption,
  })

  const selectedSize = SIZE_OPTIONS.find(s => s.id === config.size)
  const selectedFrame = FRAME_OPTIONS.find(f => f.id === config.frame)
  const selectedGlass = GLASS_OPTIONS.find(g => g.id === config.glass)

  const totalPrice = useMemo(() => {
    return calculatePrice({
      basePrice: product.basePrice,
      size: config.size,
      frame: config.frame,
      glass: config.glass,
      passepartout: config.passepartout,
    })
  }, [product.basePrice, config])

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: generateCartItemId(),
      productId: product._id,
      productName: product.name,
      productImage: product.images[0] || '',
      size: config.size,
      frame: config.frame,
      glass: config.glass,
      passepartout: config.passepartout,
      price: totalPrice,
      quantity: 1,
    }
    
    addItem(cartItem)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Boyut</h3>
        <div className="grid grid-cols-3 gap-2">
          {product.availableSizes.map((sizeId) => {
            const size = SIZE_OPTIONS.find(s => s.id === sizeId)
            if (!size) return null
            return (
              <button
                key={sizeId}
                onClick={() => setConfig(prev => ({ ...prev, size: sizeId }))}
                className={`p-3 text-sm border rounded-lg transition-all ${
                  config.size === sizeId
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {size.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Frame Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Çerçeve</h3>
        <div className="space-y-2">
          {product.availableFrames.map((frameId) => {
            const frame = FRAME_OPTIONS.find(f => f.id === frameId)
            if (!frame) return null
            return (
              <button
                key={frameId}
                onClick={() => setConfig(prev => ({ ...prev, frame: frameId }))}
                className={`w-full p-4 flex items-center justify-between border rounded-lg transition-all ${
                  config.frame === frameId
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {frame.color && (
                    <div 
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: frame.color }}
                    />
                  )}
                  <span className="text-sm">{frame.label}</span>
                </div>
                {config.frame === frameId && <Check className="w-5 h-5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Glass Selection (only if frame is selected) */}
      {config.frame !== 'no-frame' && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Cam</h3>
          <div className="space-y-2">
            {GLASS_OPTIONS.map((glass) => (
              <button
                key={glass.id}
                onClick={() => setConfig(prev => ({ ...prev, glass: glass.id }))}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  config.glass === glass.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{glass.label}</span>
                  {config.glass === glass.id && <Check className="w-5 h-5" />}
                </div>
                {glass.description && (
                  <p className="text-xs text-gray-500 mt-1">{glass.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passepartout Selection (only if frame is selected) */}
      {config.frame !== 'no-frame' && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Paspartu</h3>
          <div className="grid grid-cols-4 gap-2">
            {(['none', 'white', 'black', 'cream'] as PassepartoutOption[]).map((ppt) => (
              <button
                key={ppt}
                onClick={() => setConfig(prev => ({ ...prev, passepartout: ppt }))}
                className={`p-3 text-sm border rounded-lg transition-all ${
                  config.passepartout === ppt
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {ppt === 'none' ? 'Yok' : ppt === 'white' ? 'Beyaz' : ppt === 'black' ? 'Siyah' : 'Krem'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium">Toplam</span>
          <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              Sepete Eklendi
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Sepete Ekle
            </>
          )}
        </button>
      </div>
    </div>
  )
}
