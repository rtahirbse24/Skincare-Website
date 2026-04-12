import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  brand: 'Topicrem' | 'Novexpert';
  category: string;
  images: string[];
  price: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  howToUse: { en: string; ar: string };
  benefits: { en: string; ar: string };
  ingredients: { en: string; ar: string };
  texture: string;
  skinType: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  brand: {
    type: String,
    enum: ['Topicrem', 'Novexpert'],
    required: true,
  },
  category: {
    type: String,
    required: false,
    default: '',
  },
  images: [{
    type: String,
  }],
  price: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
  },
  name: {
    en: { type: String, required: false, default: '' },
    ar: { type: String, required: false, default: '' },
  },
  description: {
    en: { type: String, required: false, default: '' },
    ar: { type: String, required: false, default: '' },
  },
  howToUse: {
    en: { type: String, required: false, default: '' },
    ar: { type: String, required: false, default: '' },
  },
  benefits: {
    en: { type: String, required: false, default: '' },
    ar: { type: String, required: false, default: '' },
  },
  ingredients: {
    en: { type: String, required: false, default: '' },
    ar: { type: String, required: false, default: '' },
  },
  texture: { type: String, required: false, default: '' },
  skinType: { type: String, required: false, default: '' },
}, {
  timestamps: true,
});

export default mongoose.model<IProduct>('Product', ProductSchema);