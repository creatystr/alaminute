# Alaminute - AI Coding Instructions

## Project Overview
Minimalist e-commerce platform for framed posters and art prints. Reference: nordikagallery.com

**Live Server:** http://68.183.215.70:3001/ (dev) → https://alaminute.com.tr (production)
**Domain:** alaminute.com.tr

## ⚠️ IMPORTANT: No Local Testing
- **This is a PRODUCTION SERVER** - no localhost, no local testing
- All development and testing happens directly on the server (68.183.215.70)
- Port 3001 for this project (3000 is print configurator)

## Architecture

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** NextAuth.js v5 (beta)
- **Payment:** PayTR
- **Styling:** Tailwind CSS v4
- **State:** Zustand (cart)
- **Images:** Cloudinary

### Project Structure
```
alaminute/
├── app/
│   ├── (shop)/                    # Public store pages
│   │   ├── page.tsx               # Homepage
│   │   ├── layout.tsx             # Shop layout with header/footer
│   │   ├── products/
│   │   │   └── [slug]/page.tsx    # Product detail
│   │   ├── collections/
│   │   │   └── [category]/page.tsx # Category listing
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   ├── (account)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── orders/page.tsx
│   ├── admin/                     # Admin panel (protected)
│   │   ├── page.tsx               # Dashboard
│   │   ├── products/
│   │   └── orders/
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── products/
│       ├── orders/
│       └── paytr/
├── components/
│   ├── ui/                        # Base UI components
│   ├── product/                   # Product-specific
│   ├── cart/                      # Cart components
│   └── layout/                    # Header, Footer, etc.
├── lib/
│   ├── db.ts                      # MongoDB connection
│   ├── auth.ts                    # NextAuth config
│   └── utils.ts
├── models/
│   ├── Product.ts
│   ├── Order.ts
│   └── User.ts
├── store/
│   └── cart.ts                    # Zustand cart store
└── types/
    └── index.ts
```

## Database Models

### Product Schema
```typescript
{
  name: string;
  slug: string;                    // URL-friendly
  description?: string;
  artist?: string;
  category: 'minimalist' | 'nature' | 'abstract' | 'typography';
  tags: string[];
  images: string[];                // Cloudinary URLs
  basePrice: number;               // Lowest price for display
  variants: [{
    sku: string;                   // Unique identifier
    size: string;                  // "30x40", "50x70", etc.
    frame: string;                 // "Siyah", "Beyaz", "Doğal Ahşap", "Ceviz", "Çerçevesiz"
    glass: string;                 // "Standart", "Yansıma Önleyici", "Akrilik", "Camsız"
    price: number;
    stock: number;
  }];
  isActive: boolean;
  isFeatured: boolean;
}
```

### Order Schema
```typescript
{
  orderNo: string;                 // "ALM-2026-00001"
  customer: {
    userId?: ObjectId;
    name: string;
    email: string;
    phone: string;
    address: { line1, line2, city, district, postalCode };
  };
  items: [{
    productId: ObjectId;
    sku: string;
    name: string;
    variant: string;               // "50x70 / Siyah / Standart"
    price: number;
    quantity: number;
    image: string;
  }];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentId?: string;              // PayTR reference
  trackingNo?: string;
}
```

## Variant & Pricing Logic

### Size Options
- 21x30 cm (A4)
- 30x40 cm
- 40x50 cm  
- 50x70 cm
- 70x100 cm

### Frame Options
- Çerçevesiz (poster only)
- Siyah
- Beyaz
- Doğal Ahşap
- Ceviz

### Glass Options
- Camsız (for frameless)
- Standart Cam
- Yansıma Önleyici Cam
- Akrilik

### Price Calculation
```typescript
// lib/pricing.ts
const priceMatrix = {
  size: { '21x30': 1.0, '30x40': 1.3, '40x50': 1.6, '50x70': 2.0, '70x100': 3.0 },
  frame: { 'none': 0, 'black': 80, 'white': 80, 'natural': 100, 'walnut': 150 },
  glass: { 'none': 0, 'standard': 40, 'anti-reflective': 100, 'acrylic': 80 },
};

function calculatePrice(basePrice: number, size: string, frame: string, glass: string): number {
  const sizeMultiplier = priceMatrix.size[size];
  const frameCost = priceMatrix.frame[frame] * sizeMultiplier;
  const glassCost = priceMatrix.glass[glass] * sizeMultiplier;
  return Math.ceil((basePrice * sizeMultiplier) + frameCost + glassCost);
}
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (query: category, featured, search) |
| GET | `/api/products/[slug]` | Product detail |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/[id]` | Update product (admin) |
| DELETE | `/api/products/[id]` | Delete product (admin) |
| GET | `/api/orders` | User's orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/[id]` | Update status (admin) |
| POST | `/api/paytr/get-token` | Get payment token |
| POST | `/api/paytr/callback` | Payment webhook |

## Cart Store (Zustand)

```typescript
// store/cart.ts
interface CartItem {
  productId: string;
  sku: string;
  name: string;
  variant: string;      // "50x70 / Siyah / Standart"
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
```

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
AUTH_URL=https://alaminute.com.tr
AUTH_SECRET=...

# PayTR
PAYTR_MERCHANT_ID=...
PAYTR_MERCHANT_KEY=...
PAYTR_MERCHANT_SALT=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Development Commands

```bash
# Start dev server (port 3001)
cd /root/alaminute && npm run dev

# Build for production
npm run build && npm run start
```

## Key Files to Modify

| Task | File |
|------|------|
| Add product category | `types/index.ts`, `models/Product.ts` |
| Change pricing | `lib/pricing.ts` |
| Modify cart behavior | `store/cart.ts` |
| Update checkout flow | `app/(shop)/checkout/page.tsx` |
| PayTR integration | `app/api/paytr/` |
| Admin authentication | `lib/auth.ts`, middleware |

## UI/UX Guidelines
- Minimalist, white-dominant design
- Sans-serif font (Inter or Geist)
- Product cards with hover effect
- Mobile-first responsive
- Cart: Right-side drawer
- Toast notifications (Sonner)
