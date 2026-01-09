'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const basePrice = product.basePrice
  const discountedPrice = product.discountPercentage 
    ? basePrice * (1 - product.discountPercentage / 100)
    : null

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {product.discountPercentage && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            %{product.discountPercentage} İndirim
          </span>
        )}
        
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
            Yeni
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{product.artist}</p>
        
        <div className="mt-2 flex items-center gap-2">
          {discountedPrice ? (
            <>
              <span className="text-sm font-semibold text-red-600">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(basePrice)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(basePrice)}'den başlayan
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
