import { Document } from 'mongoose';
import { Schema } from 'mongoose';
import { Application } from './application.model';

export const WebApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  description: String,
  url: { type: String, required: true }
});

export interface WebApplication extends Application, Document {
  url: string;
}


