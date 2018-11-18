import { Schema, Model, model, Document } from 'mongoose';

export interface IApplication extends Document {
  _id: string;
  name: string;
  description?: string;
}

export const ApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String
});

export const Application: Model<IApplication> = model<IApplication>('Application', ApplicationSchema);
