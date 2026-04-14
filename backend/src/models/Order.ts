import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productName: string;
  brand: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: IOrderItem[];
  total: number;
  notes: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productName: { type: String, required: true },
  brand: { type: String, default: '' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true }, // ✅ make required
    email: { type: String, default: '' },
    address: { type: String, required: true }, // ✅ make required

    items: {
      type: [OrderItemSchema],
      required: true, // ✅ IMPORTANT FIX
    },

    total: { type: Number, required: true },
    notes: { type: String, default: '' },

    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true } // ✅ IMPORTANT
);

// ✅ FIX for hot reload (VERY IMPORTANT)
export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);