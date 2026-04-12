import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  brand: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  brand: {
    type: String,
    required: true,
    enum: ['Topicrem', 'Novexpert']
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate categories per brand
CategorySchema.index({ brand: 1, name: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);