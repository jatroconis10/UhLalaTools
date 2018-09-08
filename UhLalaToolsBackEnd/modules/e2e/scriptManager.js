var fs = require('fs');
var shell = require('shelljs');
var config = require('./defaultWebdriverConfig');

var newLine = "\n";
var tab = "\t";

var public = {};

public.getTestScriptPath = function(test) {
    return `tests/e2e/${test.application}/scripts/${test._id}.spec.js`;
}

public.testsToScripts = function(appId, tests) {
    createTestsDirs(appId);
    config.writeConfig(appId);
    tests.forEach(test => {
        testTranslate(appId, test);
    });
}

public.runScripts = function(appId) {
    var dir = `tests/e2e/${appId}`;
    if(shell.test('-d', dir) && shell.ls(dir + '/scripts').length !== 0) {
        shell.exec(`./node_modules/.bin/wdio ${dir}/wdio.conf.js`);
        return true;
    } else {
        return false;
    }
} 

var testTranslate = function(appId, test) {
    var resultFile = {};
    resultFile.name = test.name;

    var data = "var assert = require('assert');" + newLine;

    data += `describe('${test.name}', function() {${newLine}`;

    data += `${tab}it('${test.description}', function() {${newLine}`;

    //Translate the statements into actual tests
    test.commands.forEach(command => {
       data += tab + tab + commandToWebDriver(command); 
    });

    data += `${tab}})` + newLine;

    data += '})';
    fs.writeFileSync(`tests/e2e/${appId}/scripts/${test._id}.spec.js`, data);

    return data;
}

function createTestsDirs(appId) {
    var dir = 'tests/e2e/' + appId;
    var dirs = [dir + '/scripts', dir + '/reports'];
    shell.mkdir('-p', dirs);
}

function commandToWebDriver(command) {
    var result = '';
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
            var timeout = command.value || 500;
            result = `browser.waitForVisible('${command.selector}', ${timeout})`;
            break;
        case 'assertExists':
            result = `expect($('${command.selector}')).toBeDefined()`;
            break;
        case 'assertTextMatches':
            var getText = `$('${command.selector}').getText()`;
            result = `expect(${getText}).toBe('${command.value}')`;
            break;
    }
    return result + newLine;
}

module.exports = public;
