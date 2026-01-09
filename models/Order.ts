import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface IOrderCustomer {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: ICustomerAddress;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder extends Document {
  orderNo: string;
  customer: IOrderCustomer;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentId?: string;
  trackingNo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  variant: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const AddressSchema = new Schema<ICustomerAddress>({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  postalCode: { type: String },
});

const CustomerSchema = new Schema<IOrderCustomer>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNo: { type: String, required: true, unique: true },
    customer: { type: CustomerSchema, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String },
    paymentId: { type: String },
    trackingNo: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes
OrderSchema.index({ orderNo: 1 });
OrderSchema.index({ 'customer.userId': 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
