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
  status: 'pending' | 'confirmed' | 'delivered';
  timestamp: Date;
}

const OrderItemSchema = new Schema({
  productName: { type: String, required: true },
  brand: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  items: { type: [OrderItemSchema], default: [] },
  total: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);