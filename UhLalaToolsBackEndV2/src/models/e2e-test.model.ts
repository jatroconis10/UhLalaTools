import { Schema, Model, model, Document } from 'mongoose';

export interface IE2ETest extends Document {
  name: string;
  description?: string;
  generated: boolean;
  executed: boolean;
  commands: any[];
}

export const E2ETestSchema: Schema = new Schema({
  webApplication: { type: Schema.Types.ObjectId, ref: 'WebApplication' },
  name: { type: String, required: true },
  description: { type: String },
  generated: { type: Boolean, default: false },
  executed: { type: Boolean, default: false },
  commands: [Schema.Types.Mixed]
});

export const E2ETest: Model<IE2ETest> = model<IE2ETest>('E2ETest', E2ETestSchema);
