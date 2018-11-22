import shelljs from 'shelljs';
import fs from 'fs';

import { IE2ETest } from '.';

const newLine = '\n';
const tab = '\t';

export class ScriptManager {
  static createWebApplicationE2ETestsDirectory(applicationId: string) {
    const dir = `tests/e2e/${applicationId}`;
    const dirs = [`${dir}/scripts`, `${dir}/reports`];
    shelljs.mkdir('-p', dirs);
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
