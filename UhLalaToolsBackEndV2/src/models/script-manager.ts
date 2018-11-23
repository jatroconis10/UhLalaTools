import shelljs from 'shelljs';
import fs from 'fs';
import path from 'path';

import { E2ETest, IE2ETest, IWebApplication } from '.';
import { IRandomTest } from './random-test.model';
import { throwError } from '../controllers';
import { WebdriverManager } from './webdriver-manager';

const newLine = '\n';
const tab = '\t';

export class ScriptManager {
  static createWebApplicationE2ETestsDirectory(applicationId: string) {
    const dir = `tests/e2e/${applicationId}`;
    const dirs = [`${dir}/scripts`, `${dir}/reports`];
    shelljs.mkdir('-p', dirs);
  }

  static executeE2ETests(webApplicationId: string) {
    const dir = `tests/e2e/${webApplicationId}`;

    if (shelljs.test('-d', dir) && shelljs.ls(dir + '/scripts').length !== 0) {
      const wdio = path.normalize('./node_modules/.bin/wdio');
      const conf = path.normalize(`${dir}/wdio.conf.js`);

      shelljs.exec(`${wdio} ${conf}`, (code, stdout, stderr) => {
        if (code) {
          E2ETest.find({ webApplication: webApplicationId }).then((tests) => {
            tests.forEach((test) => {
              test.executed = true;
              test.save();
            });
          });
        }
      });
      return 'E2E Tests scripts queued for execution';
    } else {
      return 'Could not find any E2E test script for execution';
    }
  }

  static generateRandomTestScript(webApplication: IWebApplication, randomTest: IRandomTest) {
    ScriptManager.createRandomTestFolder(randomTest);

    const jsonConfiguration = JSON.stringify(
      WebdriverManager.getRandomTestWebdriverConfiguration(webApplication, randomTest)
    );
    const configurationFileContent = `exports.config = ${jsonConfiguration}`;
    fs.writeFileSync(`tests/random/${randomTest._id}/wdio.conf.js`, configurationFileContent);

    const data = `
      function loadScript(callback) {
        var s = document.createElement('script');
        s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
        if (s.addEventListener) {
          s.addEventListener('load', callback, false);
        } else if (s.readyState) {
          s.onreadystatechange = callback;
        }
        document.body.appendChild(s);
      }

      function unleashGremlins(ttl, callback) {
        function stop() {
          horde.stop();
          callback();
        }

        var horde = window.gremlins.createHorde();
        horde.seed(${randomTest.seed});
        horde.after(callback);
        window.onbeforeunload = stop;
        setTimeout(stop, ttl);
        horde.unleash({ nb: ${randomTest.numGremlins} });
      }

      describe('${webApplication.url} with gremlins', function () {
        it('should survive the attack', function () {
          browser.url('${webApplication.url}');
          browser.timeoutsAsyncScript(60000);
          browser.executeAsync(loadScript);
          browser.timeoutsAsyncScript(60000);
          browser.executeAsync(unleashGremlins, ${randomTest.timeToLive});
        });

        afterAll(function() {
          browser.log('browser').value.forEach(function(log) {
            browser.logger.info(log.message.split(' ')[2]);
          });
        });
      });
    `;

    fs.writeFileSync(`tests/random/${randomTest._id}/scripts/${randomTest._id}.spec.js`, data);
  }

  private static createRandomTestFolder(randomTest: IRandomTest) {
    const dir = `tests/random/${randomTest._id}`;
    const dirs = [`${dir}/scripts`, `${dir}/reports`];
    shelljs.mkdir('-p', dirs);
  }

  static executeRandomTest(randomTest: IRandomTest) {
    const dir = `tests/random/${randomTest._id}`;
    if (shelljs.test('-d', dir) && shelljs.ls(dir + '/scripts').length !== 0) {
      const dir1 = path.normalize('./node_modules/.bin/wdio');
      const dir2 = path.normalize(`${dir}/wdio.conf.js`);
      shelljs.exec(`${dir1} ${dir2}`, function (code) {
        if (code) {
          randomTest.executed = true;
          randomTest.save();
        }
      });
    } else {
      throwError(404, 'There are no random test to execute');
    }
  }

  static generateE2ETestScript(e2eTest: IE2ETest, version: string) {
    const dir = `tests/e2e/${e2eTest.webApplication}/screenshots/${e2eTest._id}/${version}`;
    shelljs.mkdir('-p', dir);
    let data = "var assert = require('assert');" + newLine;
    data += `describe('${e2eTest.name}', function() {${newLine}`;
    data += `${tab}it('${e2eTest.description}', function() {${newLine}`;
    for (let i = 0; i < e2eTest.commands.length; i++) {
      data += tab + tab + ScriptManager.commandToWebDriver(e2eTest.commands[i]) + newLine;
      data += `${tab}${tab}browser.saveScreenshot('${dir}/test${i}.png')` + newLine;
    }
    data += `${tab}})` + newLine;
    data += '})';
    fs.writeFileSync(`tests/e2e/${e2eTest.webApplication}/scripts/${e2eTest._id}.spec.js`, data);
    return data;
  }

  private static commandToWebDriver(command: any) {
    let result = '';
    switch (command.type) {
      case 'goTo':
        result = `browser.url('${command.selector}')`;
        break;
      case 'click':
        result = `browser.click('${command.selector}')`;
        break;
      case 'keys':
        result = `$('${command.selector}').keys('${command.value}')`;
        break;
      case 'selectByText':
        result = `browser.selectByVisibleText('${command.selector}', '${command.value}')`;
        break;
      case 'waitVisible':
        const timeout = command.value || 500;
        result = `browser.waitForVisible('${command.selector}', ${timeout})`;
        break;
      case 'assertExists':
        result = `expect($('${command.selector}')).toBeDefined()`;
        break;
      case 'assertTextMatches':
        const getText = `$('${command.selector}').getText()`;
        result = `expect(${getText}).toBe('${command.value}')`;
        break;
    }
    return result + newLine;
  }
}
