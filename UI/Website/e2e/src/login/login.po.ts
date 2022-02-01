import { browser, by, element } from 'protractor';

export class LoginPage {
  private credentials = {
    username: 'test',
    password: 'test'
  };

  fillCredentials(credentials: any = this.credentials) {
    element(by.css('[id="login-Username"]')).sendKeys(credentials.username);
    element(by.css('[id="login-Password"]')).sendKeys(credentials.password);
    element(by.css('[id="submit"]')).click();
  }

  navigateTo() {
    return browser.get('/login');
  }

  getPageTitle() {
    return element(by.css('app-root h1')).getText();
  }
}
