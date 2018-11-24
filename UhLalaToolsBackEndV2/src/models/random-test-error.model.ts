import { Schema, Model, model, Document } from 'mongoose';

export interface IRandomTestError extends Document {
  randomTest: string;
  error: string;
}

export const RandomTestErrorSchema: Schema = new Schema({
  randomTest: { type: Schema.Types.ObjectId, ref: 'RandomTest' },
  error: { type: String, required: true }
});

export const RandomTestError: Model<IRandomTestError> = model<IRandomTestError>('RandomTestError', RandomTestErrorSchema);
