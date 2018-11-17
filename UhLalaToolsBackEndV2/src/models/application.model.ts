import { Schema, Model, model, Document } from 'mongoose';

export interface IApplication extends Document {
  name: string;
  description?: string;
}

export const ApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String,
  webApplication: { type: Schema.Types.ObjectId, ref: 'WebApplication' },
  mobileApplication: { type: Schema.Types.ObjectId, ref: 'MobileApplication' }
});

export const Application: Model<IApplication> = model<IApplication>('Application', ApplicationSchema);
