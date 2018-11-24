import { Schema, Model, model, Document } from 'mongoose';

import { ScriptManager } from './script-manager';
import { WebApplication } from './web-application.model';
import { WebdriverManager } from './webdriver-manager';

import { throwError } from '../controllers';

export interface IE2ETest extends Document {
  webApplication: string;
  name: string;
  description: string;
  generated: boolean;
  executed: boolean;
  commands: any[];
}

export const E2ETestSchema: Schema = new Schema({
  webApplication: { type: Schema.Types.ObjectId, ref: 'WebApplication' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  generated: { type: Boolean, default: false },
  executed: { type: Boolean, default: false },
  commands: [Schema.Types.Mixed]
});

export const E2ETest: Model<IE2ETest> = model<IE2ETest>('E2ETest', E2ETestSchema);

export class E2ETestUtils {
  static generateE2ETestsScripts(e2eTests: IE2ETest[], version: string): void {
    const webApplicationId: string = e2eTests[0].webApplication;
    ScriptManager.createWebApplicationE2ETestsDirectory(webApplicationId);
    WebApplication.findById(webApplicationId, (err, webApplication) => {
      if (err) throwError(500, 'Unexpected error');
      WebdriverManager.writeE2ETestsWebdriverConfiguration(webApplication);
    });
    e2eTests.forEach(e2eTest => {
      ScriptManager.generateE2ETestScript(e2eTest, version);
      e2eTest.generated = true;
      e2eTest.save();
    });
  }
}
