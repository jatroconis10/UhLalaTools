import fs from 'fs';

import { IWebApplication } from './web-application.model';

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
      capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless', '--disable-gpu', '--window-size=1980,1080']
        },
      }],
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
          outputDir: `./tests/e2e/${webApplication._id}/reports/`
        },
      },
      jasmineNodeOpts: {
        defaultTimeoutInterval: 20000,
      }
    };
  }
}
