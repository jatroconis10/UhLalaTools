/* jshint esversion: 6 */

var {
  defineSupportCode
} = require('cucumber');
var {
  expect
} = require('chai');

defineSupportCode(({
  Given,
  When,
  Then
}) => {
  Given('I go to losestudiantes home screen', () => {
    browser.url('/');
    if (browser.isVisible('button=Cerrar')) {
      browser.click('button=Cerrar');
    }
  });

  When('I open the login screen', () => {
    browser.waitForVisible('button=Ingresar', 5000);
    browser.click('button=Ingresar');
  });

  When('I fill a wrong email and password', () => {
    var cajaLogIn = browser.element('.cajaLogIn');

    var mailInput = cajaLogIn.element('input[name="correo"]');
    mailInput.click();
    mailInput.keys('wrongemail@example.com');

    var passwordInput = cajaLogIn.element('input[name="password"]');
    passwordInput.click();
    passwordInput.keys('123467891');
  });

  When('I try to login', () => {
    var cajaLogIn = browser.element('.cajaLogIn');
    cajaLogIn.element('button=Ingresar').click();
  });

  Then('I expect to not be able to login', () => {
    browser.waitForVisible('.aviso.alert.alert-danger', 5000);
  });

  Given(/^I go to (.*)$/ , (url) => {
    browser.url(url);
  });

  When(/^I wait (.*) ms to see the element (.*)$/ , (ms, element) => {
    browser.waitForVisible(element, ms);
  });

  Then(/^I wait (.*) ms to see the element (.*)$/ , (ms, element) => {
    browser.waitForVisible(element, ms);
  });

  Then(/^I type (.*) in (.*)$/ , (text, element) => {
    browser.element(text).keys(element);
  });

  Then(/^I click the element (.*)$/ , (element) => {
    browser.click(element);
  });

  Then(/^I expect (.*) to exist$/ , (element) => {
    expect($(element)).toBeDefined();
  });

  Then(/^I go to (.*)$/ , (url) => {
    browser.url(url);
  });
});
