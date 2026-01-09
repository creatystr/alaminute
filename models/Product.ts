import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  sku: string;
  size: string;
  frame: string;
  glass: string;
  price: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  artist?: string;
  category: 'minimalist' | 'nature' | 'abstract' | 'typography';
  tags: string[];
  images: string[];
  basePrice: number;
  variants: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true },
  size: { type: String, required: true },
  frame: { type: String, required: true },
  glass: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    artist: { type: String },
    category: {
      type: String,
      required: true,
      enum: ['minimalist', 'nature', 'abstract', 'typography'],
    },
    tags: [{ type: String }],
    images: [{ type: String }],
    basePrice: { type: Number, required: true },
    variants: [VariantSchema],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ 'variants.sku': 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
