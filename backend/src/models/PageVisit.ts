import mongoose, { Schema, Document } from 'mongoose';

export interface IPageVisit extends Document {
  page: string;
  count: number;
}

const PageVisitSchema: Schema = new Schema({
  page: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
});

export default mongoose.model<IPageVisit>('PageVisit', PageVisitSchema);