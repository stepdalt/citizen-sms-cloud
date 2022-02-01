import { LoginPage } from './login.po';
import { browser } from 'protractor';

// To debug e2e tests:
// node --inspect-brk ./node_modules/protractor/bin/protractor ./e2e/protractor.conf.js
// open chrome with chrome://inspect/#devices

describe('Navigate to Login Page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  it('navigating to login page should display page title: Login', () => {
    expect(page.getPageTitle()).toEqual('Login');
  });

  it('when login is successful — should be redirected to the home page', () => {
    page.fillCredentials();
    browser.waitForAngular();
    expect(page.getPageTitle()).toEqual('Home');
  });
});
