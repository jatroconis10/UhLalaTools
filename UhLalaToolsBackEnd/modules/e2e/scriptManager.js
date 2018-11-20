var fs = require('fs');
var shell = require('shelljs');
var config = require('./defaultWebdriverConfig');
var path = require('path');

var E2ETest = require('./models/e2e-test');

var newLine = "\n";
var tab = "\t";

var public = {};

public.getTestScriptPath = function(test) {
    return `tests/e2e/${test.application}/scripts/${test._id}.spec.js`;
}

public.getTestReportPath = function(test) {
    return `tests/e2e/${test.application}/reports/wdio-report.html`;
}

public.testsToScripts = function(appId, tests, version) {
    createTestsDirs(appId);
    config.writeConfig(appId);
    tests.forEach(test => {
        testTranslate(appId, test, version);
        test.generated = true;
        test.save();
    });
}

public.runScripts = async function(appId) {
    var dir = `tests/e2e/${appId}`;
    
    if(shell.test('-d', dir) && shell.ls(dir + '/scripts').length !== 0) {
        var wdio = path.normalize('./node_modules/.bin/wdio');
        var conf = path.normalize(`${dir}/wdio.conf.js`);

        var execPromise = new Promise(function(resolve, reject) {
            shell.exec(`${wdio} ${conf}`, function(code, stdout, stderr) {
                if (code != 0) return reject(new Error(stderr));
                return resolve(stdout);
            });
        });

        var result = await execPromise.then(() => {
            E2ETest.find({application: appId}).then((tests) => {
                tests.forEach((test) => {
                    test.executed = true;
                    test.save();
                });
            });
            return true;
        }).catch(() => false);
        return result;
    } else {
        return false;
    }
}

var testTranslate = function(appId, test, version) {
    var resultFile = {};
    resultFile.name = test.name;

    var dir = `tests/e2e/${appId}/screenshots/${test.id}/${version}`;
    shell.mkdir('-p', dir);

    var data = "var assert = require('assert');" + newLine;

    data += `describe('${test.name}', function() {${newLine}`;

    data += `${tab}it('${test.description}', function() {${newLine}`;

    //Translate the statements into actual tests
    for(var i = 0; i < test.commands.length; i++){
       data += tab + tab + commandToWebDriver(test.commands[i]) + newLine;
       data += `${tab}${tab}browser.saveScreenshot('${dir}/test${i}.png')` + newLine;
    }
    
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
