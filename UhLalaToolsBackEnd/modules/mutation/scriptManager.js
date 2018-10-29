/* jshint esversion: 6 */

var fs = require('fs');
var shell = require('shelljs');
var path = require('path');

var newLine = '\n';

var public = {};

public.testTranslate = function (test) {
    var resultFile = {};
    resultFile.name = "stryker.conf.js";

    var data = "module.exports = function(config) {" + newLine;
    data += "  config.set({" + newLine;
    if(test.files && test.files.length > 0) {
        data += `    files: ["${test.files[0]}"`;
        for(var i = 1; i < test.files.length; i++){
            data += `, "${test.files[i]}"`;
        }
        data += `],` + newLine;
    }
    if(test.mutate && test.mutate.length > 0) {
        data += `    mutate: ["${test.mutate[0]}"`;
        for(var i = 1; i < test.mutate.length; i++){
            data += `, "${test.mutate[i]}"`;
        }
        data += `],` + newLine;
    }
    data += `    mutator: "${test.mutator}",` + newLine;
    data += "    transpilers: []," + newLine;
    if(test.reporters && test.reporters.length > 0) {
        data += `    reporters: ["${test.reporters[0]}"`;
        for(var i = 1; i < test.reporters.length; i++){
            data += `, "${test.reporters[i]}"`;
        }
        data += `],` + newLine;
    }
    data += `    testRunner: "${test.testRunner}",` + newLine;
    data += `    testFramework: "${test.testFramework}",` + newLine;
    data += `    coverageAnalysis: "perTest",` + newLine;
    data += "    karma: {" + newLine;
    data += `      configFile: "${test.configFile}"` + newLine;
    data += "    }" + newLine;
    data += "  });" + newLine;
    data += "};" + newLine;
    
    var rootDir = path.normalize(test.dir);
    var stryker = path.normalize('node_modules/.bin/stryker');
    var cmd = 'npm install --save-dev stryker stryker-api';
    if(test.reporters.includes('html')) cmd += ' stryker-html-reporter';
    if(test.mutator == 'javascript') cmd += ' stryker-javascript-mutator';
    if(test.mutator == 'typescript') cmd += ' stryker-typescript';
    if(test.mutator == 'vue') cmd += ' stryker-vue-mutator';
    if(test.testRunner == 'karma') cmd += ' stryker-karma-runner';
    if(test.testRunner == 'jest') cmd += ' stryker-jest-runner';
    if(test.testRunner == 'mocha') cmd += ' stryker-mocha-runner';
    if(test.testRunner == 'jasmine') cmd += ' stryker-jasmine-runner';
    if(test.testFramework == 'mocha') cmd += ' stryker-mocha-framework';
    if(test.testFramework == 'jasmine') cmd += ' stryker-jasmine';
    if (!shell.test('-e', path.normalize(`${rootDir}/${stryker}`))) {
        shell.exec(cmd, {cwd: rootDir});
    }
    fs.writeFileSync(`${rootDir}/stryker.conf.js`, data);
};

public.runTests = function(test) {
    var rootDir = path.normalize(test.dir);
    var stryker = path.normalize('node_modules/.bin/stryker');
    shell.exec(`${stryker} run`, {cwd: rootDir});
    shell.exec('reports/mutation/html/index.html', {cwd: rootDir});
};

module.exports = public;
