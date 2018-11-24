import { Schema, Model, model, Document } from 'mongoose';
import { IApplication } from './application.model';

export const DEFAULT_CAPABILITIES = [{
  maxInstances: 5,
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--disable-gpu', '--window-size=1980,1080']
  },
}];

export interface IWebApplication extends Document {
  application: IApplication;
  url: string;
  browserCapabilities: any[];
}

export const WebApplicationSchema: Schema = new Schema({
  application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  url: { type: String, required: true },
  browserCapabilities: [Schema.Types.Mixed]
});

export const WebApplication: Model<IWebApplication> =
  model<IWebApplication>('WebApplication', WebApplicationSchema);
