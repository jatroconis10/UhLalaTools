var fs = require('fs');

var newLine = "\n"
var tab = "\t"

var testTranslate = function(test) {
    var resultFile = {};
    resultFile.name = test.name;

    var data = "var assert = require('assert');" + newLine;

    data += `describe('${test.description}', function() {${newLine}`;

    data += `${tab}it('${test.description}', function() {${newLine}`;

    //Translate the statements into actual tests
    test.commands.forEach(command => {
       data += tab + tab + commandToWebDriver(command); 
    });

    data += `${tab}})` + newLine;

    data += '})';
    createTestsDir()
    fs.writeFileSync(`../../tests/e2e/${test.name.replace(/\s/g, '_')}.spec.js`, data)

    return data;
    
}

function createTestsDir() {
    var dir = '../../tests'
    var e2e = 'e2e'

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    dir = dir + '/' + e2e
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

function commandToWebDriver(command) {
    var result = ''
    switch (command.type) {
        case 'goTo':
            result = `browser.url('${command.selector}')`
            break;
        case 'click':
            result = `browser.click('${command.selector}')`
            break;
        case 'keys':
            result = `$('${command.selector}').keys('${command.value}')`
            break;
        case 'selectByText':
            result = `browser.selectByVisibleText('${command.selector}', '${command.value}')`
            break;
        case 'waitVisible':
            var timeout = command.value || 500
            result = `browser.waitForVisible('${command.selector}', ${timeout})`
            break;
        case 'assertExists':
            result = `expect($('${command.selector}')).toBeDefined();`
            break;
        case 'assertTextMatches':
            var getText = `$('${command.selector}').getText();` 
            result = `expect(${getText}).toBe('${command.value}')`
            break;
    }

    return result + newLine;
}

module.exports = {
    testTranslate: testTranslate,
}