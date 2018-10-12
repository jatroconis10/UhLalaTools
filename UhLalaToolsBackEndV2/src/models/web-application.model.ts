import { Schema } from 'mongoose';
import { Application } from './application.model';

export const webApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  description: String,
  url: String
});

export interface WebApplication extends Application {
  url: string;
}
