import fs from 'fs';

import { IWebApplication } from './web-application.model';
import { IRandomTest } from './random-test.model';

export class WebdriverManager {
  static writeE2ETestsWebdriverConfiguration(webApplication: IWebApplication) {
    const jsonConfiguration = JSON.stringify(WebdriverManager.getWebApplicationWebdriverConfiguration(webApplication));
    const configurationFileContent = `exports.config = ${jsonConfiguration}`;
    fs.writeFileSync(`tests/e2e/${webApplication._id}/wdio.conf.js`, configurationFileContent);
  }

  static getWebApplicationWebdriverConfiguration(webApplication: IWebApplication): any {
    return {
      specs: [
        `./tests/e2e/${webApplication._id}/scripts/*.js`
      ],
      exclude: [],
      maxInstances: 10,
      capabilities: webApplication.browserCapabilities,
      sync: true,
      logLevel: 'verbose',
      coloredLogs: true,
      deprecationWarnings: true,
      bail: 0,
      screenshotPath: `./tests/e2e/${webApplication._id}/errorShots/`,
      baseUrl: webApplication.url,
      waitforTimeout: 10000,
      connectionRetryTimeout: 90000,
      connectionRetryCount: 3,
      services: ['selenium-standalone'],
      framework: 'jasmine',
      reporters: ['dot', 'html-format'],
      reporterOptions: {
        htmlFormat: {
          outputDir: `./tests/e2e/${webApplication._id}/reports`
        },
      },
      jasmineNodeOpts: {
        defaultTimeoutInterval: 20000,
      }
    };
  }

  static getRandomTestWebdriverConfiguration(webApplication: IWebApplication, randomTest: IRandomTest): any {
    return {
      specs: ['./tests/random/' + randomTest._id + '/scripts/*.js'],
      exclude: [],
      maxInstances: 10,
      capabilities: webApplication.browserCapabilities,
      sync: true,
      logLevel: 'verbose',
      coloredLogs: true,
      bail: 0,
      screenshotPath: './errorShots/',
      baseUrl: webApplication.url,
      waitforTimeout: 10000,
      connectionRetryTimeout: 90000,
      connectionRetryCount: 3,
      services: ['selenium-standalone'],
      framework: 'jasmine',
      reporters: ['dot'],
      jasmineNodeOpts: {
        defaultTimeoutInterval: 80000,
        expectationResultHandler: function () { }
      }
    };
  }
}
