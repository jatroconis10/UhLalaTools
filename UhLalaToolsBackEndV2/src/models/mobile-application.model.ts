import { Schema, Model, model, Document } from 'mongoose';
import { IApplication } from './application.model';

export interface IMobileApplication extends Document {
  application: IApplication;
  url: string;
}

export const MobileApplicationSchema: Schema = new Schema({
  application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  url: { type: String, required: true },
});

export const MobileApplication: Model<IMobileApplication> =
  model<IMobileApplication>('MobileApplication', MobileApplicationSchema);
