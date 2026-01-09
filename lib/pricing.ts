import { SIZE_OPTIONS, FRAME_OPTIONS, GLASS_OPTIONS } from '@/types';

interface PriceMatrix {
  size: Record<string, number>;
  frame: Record<string, number>;
  glass: Record<string, number>;
}

const priceMatrix: PriceMatrix = {
  size: Object.fromEntries(SIZE_OPTIONS.map(s => [s.value, s.multiplier])),
  frame: Object.fromEntries(FRAME_OPTIONS.map(f => [f.value, f.price])),
  glass: Object.fromEntries(GLASS_OPTIONS.map(g => [g.value, g.price])),
};

/**
 * Calculate product price based on variant selections
 */
export function calculatePrice(
  basePrice: number,
  size: string,
  frame: string,
  glass: string
): number {
  const sizeMultiplier = priceMatrix.size[size] || 1;
  const frameCost = (priceMatrix.frame[frame] || 0) * sizeMultiplier;
  const glassCost = (priceMatrix.glass[glass] || 0) * sizeMultiplier;
  
  return Math.ceil((basePrice * sizeMultiplier) + frameCost + glassCost);
}

/**
 * Generate SKU from variant options
 */
export function generateSku(productSlug: string, size: string, frame: string, glass: string): string {
  const sizeCode = size.replace('x', '');
  const frameCode = frame.substring(0, 3).toUpperCase();
  const glassCode = glass.substring(0, 3).toUpperCase();
  return `${productSlug.toUpperCase()}-${sizeCode}-${frameCode}-${glassCode}`;
}

/**
 * Format variant for display
 */
export function formatVariant(size: string, frame: string, glass: string): string {
  const sizeLabel = SIZE_OPTIONS.find(s => s.value === size)?.label || size;
  const frameLabel = FRAME_OPTIONS.find(f => f.value === frame)?.label || frame;
  const glassLabel = GLASS_OPTIONS.find(g => g.value === glass)?.label || glass;
  
  return `${sizeLabel} / ${frameLabel} / ${glassLabel}`;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate order number
 */
export function generateOrderNo(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ALM-${year}-${random}`;
}
