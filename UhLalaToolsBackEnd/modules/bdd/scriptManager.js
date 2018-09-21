/*jshint esversion: 6 */

var fs = require('fs');
var shell = require('shelljs');
var path = require('path');

var config = require('./defaultWebdriverConfig');

var newLine = '\n';

var public = {};

public.getTestScriptPath = function (test) {
    return `tests/bdd/${test.application}/features/${test._id}.feature`;
};

public.testsToScripts = function (application, tests) {
    setup(application);
    tests.forEach(test => {
        testTranslate(application._id, test);
    });
};

public.runScripts = async function (appId) {
    var dir = `tests/bdd/${appId}`;
    if (shell.test('-d', dir) && shell.ls(dir + '/features').length !== 0) {
        var wdio = path.normalize('node_modules/webdriverio/bin/wdio');
        var conf = path.normalize(`${dir}/wdio.conf.js`);
        shell.exec(`node ${wdio} ${conf}`, function (code) {
            if (code === 0) {
                console.log("Success");
            } else {
                console.log("Fail");
            }
        });
        return true;
    } else {
        return false;
    }
}

var testTranslate = function (appId, test, seed) {
    var resultFile = {};
    resultFile.name = test.name;

    var data = `Feature: ${test.feature}` + newLine;
    data += newLine;
    test.scenarios.forEach(scenario => {
        data += `Scenario: ${scenario.description}` + newLine;
        scenario.given.forEach(given => {
            data += "   Given " + given.command + newLine;
        });
        scenario.when.forEach(when => {
            data += "   When " + when.command + newLine;
        });
        scenario.when.forEach(then => {
            data += "   Then " + then.command + newLine;
        });
        data += newLine;
    });

    fs.writeFileSync(`tests/bdd/${appId}/features/${test._id}.feature`, data);

    return data;
};

function createTestsDirs(appId) {
    // Rethink the directories considering the fleeting nature of tests
    var dir = 'tests/bdd/' + appId;
    var dirs = [dir + '/features', dir + '/reports'];
    shell.mkdir('-p', dirs);
}

function setup(application) {
    createTestsDirs(application._id);
    config.writeConfig(application);
    var dir1 = 'modules/bdd/step-definitions/index.js';
    var dir2 = `tests/bdd/${application._id}/features/step-definitions`;
    shell.mkdir('-p', dir2);
    shell.exec(`cp ${dir1} ${dir2}`);
}

module.exports = public;