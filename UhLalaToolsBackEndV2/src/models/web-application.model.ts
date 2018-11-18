import { Schema, Model, model, Document } from 'mongoose';
import { IApplication } from './application.model';

export interface IWebApplication extends Document {
  _id: string;
  application: IApplication;
  url: string;
}

export const WebApplicationSchema: Schema = new Schema({
  application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  url: { type: String, required: true },
});

export const WebApplication: Model<IWebApplication> =
  model<IWebApplication>('WebApplication', WebApplicationSchema);
