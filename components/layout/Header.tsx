'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">alaminute</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tüm Ürünler
            </Link>
            <Link href="/products?category=poster" className="text-gray-600 hover:text-gray-900 transition-colors">
              Posterler
            </Link>
            <Link href="/products?category=art" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sanat Eserleri
            </Link>
            <Link href="/products?category=photo" className="text-gray-600 hover:text-gray-900 transition-colors">
              Fotoğraflar
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/account" className="hidden md:block text-gray-600 hover:text-gray-900">
              <User className="w-6 h-6" />
            </Link>
            
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Tüm Ürünler
              </Link>
              <Link 
                href="/products?category=poster" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Posterler
              </Link>
              <Link 
                href="/products?category=art" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Sanat Eserleri
              </Link>
              <Link 
                href="/products?category=photo" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Fotoğraflar
              </Link>
              <Link 
                href="/account" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Hesabım
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
