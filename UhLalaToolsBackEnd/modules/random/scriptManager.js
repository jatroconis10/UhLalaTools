var fs = require('fs');
var shell = require('shelljs');
var config = require('./defaultWebdriverConfig');
var path = require('path');


var newLine = "\n";
var tab = "\t";

var public = {};

public.getTestScriptPath = function(test) {
    return `tests/random/${test.application}/scripts/${test._id}-gremlins-test.js`;
}

public.testsToScripts = function(application, tests) {
    createTestsDirs(application._id);
    config.writeConfig(application);
    tests.forEach(test => {
        testTranslate(application._id, test);
    });
}

public.runScripts = function(appId) {
    var dir = `tests/random/${appId}`;
    if(shell.test('-d', dir) && shell.ls(dir + '/scripts').length !== 0) {
        var dir1 = path.normalize('./node_modules/.bin/wdio');
        var dir2 = path.normalize(`${dir}/wdio.conf.js`);
        shell.exec(dir1 + ' ' + dir2);
        return true;
    } else {
        return false;
    }
} 

var testTranslate = function(appId, test) {
    var resultFile = {};
    resultFile.name = test.name;

    var data = "var assert = require('assert');" + newLine;
    data += "function loadScript(callback) {" + newLine;
    data += "  var s = document.createElement('script');" + newLine;
    data += "  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';" + newLine;
    data += "  if (s.addEventListener) {" + newLine;
    data += "    s.addEventListener('load', callback, false);" + newLine;
    data += "  } else if (s.readyState) {" + newLine;
    data += "    s.onreadystatechange = callback;" + newLine;
    data += "  }" + newLine;
    data += "  document.body.appendChild(s);" + newLine;
    data += "}" + newLine;
    data + newLine
    data += "function unleashGremlins(ttl, callback) {" + newLine;
    data += "  function stop() {" + newLine;
    data += "    horde.stop();" + newLine;
    data += "    callback();" + newLine;
    data += "  }" + newLine;
    data += "  var horde = window.gremlins.createHorde();" + newLine;
    data += `  horde.seed(${test.seed});` + newLine;
    data += "  horde.after(callback);" + newLine;
    data += "  window.onbeforeunload = stop;" + newLine;
    data += "  setTimeout(stop, ttl);" + newLine;
    data += "  horde.unleash();" + newLine;
    data += "}" + newLine;

    data +=`describe('${test.name}', function() {` + newLine;

    data +=`  it('${test.description}', function() {` + newLine;
    data +="    browser.url('/');" + newLine;

    data +="    browser.timeoutsAsyncScript(60000);" + newLine;
    data +="    browser.executeAsync(loadScript);" + newLine;

    data +="    browser.timeoutsAsyncScript(60000);" + newLine;
    data +=`    browser.executeAsync(unleashGremlins, ${test.numGremlins});` + newLine;
    data +="  });" + newLine;

    data +="  afterAll(function() {" + newLine;
    data +="    browser.log('browser').value.forEach(function(log) {" + newLine;
    data +="      browser.logger.info(log.message.split(' ')[2]);" + newLine;
    data +="    });" + newLine;
    data +="  });" + newLine;

    data +="});" + newLine;
    
    fs.writeFileSync(`tests/random/${appId}/scripts/${test._id}.spec.js`, data);

    return data;
}

function createTestsDirs(appId) {
    var dir = 'tests/random/' + appId;
    var dirs = [dir + '/scripts', dir + '/reports'];
    shell.mkdir('-p', dirs);
}

module.exports = public;
