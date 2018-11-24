import { Schema, Model, model, Document } from 'mongoose';
import { ScriptManager } from './script-manager';
import { IWebApplication } from '.';

export interface IRandomTest extends Document {
  webApplication: string;
  timeToLive: number;
  seed: number;
  numRuns: number;
  numGremlins: number;
  generated: boolean;
  executed: boolean;
}

export const RandomSchema: Schema = new Schema({
  webApplication: { type: Schema.Types.ObjectId, ref: 'WebApplication' },
  timeToLive: { type: Number, default: 50000 },
  seed: { type: Number, default: 1234 },
  numRuns: { type: Number, default: 1 },
  numGremlins: { type: Number, default: 10 },
  generated: { type: Boolean, default: false },
  executed: { type: Boolean, default: false }
});

export const RandomTest: Model<IRandomTest> = model<IRandomTest>('RandomTest', RandomSchema);

export class RandomTestUtils {
  static generateRandomTestScript(webApplication: IWebApplication, randomTest: IRandomTest) {
    ScriptManager.generateRandomTestScript(webApplication, randomTest);
  }

  static executeRandomTest(randomTest: IRandomTest) {
    ScriptManager.executeRandomTest(randomTest);
  }
}
