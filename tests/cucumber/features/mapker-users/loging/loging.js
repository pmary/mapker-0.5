module.exports = function () {
  var url = require('url');

  //////////////
  //  Common  //
  //////////////
  this.Given(/^I have created a login page with a login form$/, function (callback) {
    // Test if a route for /login exist
    return this.client.url(process.env.ROOT_URL + 'login');
  });

  ////////////////////////////////////////////////
  //  Scenario: Connect to an existing account  //
  ////////////////////////////////////////////////
  this.Given(/^a user has created an account$/, function (callback) {
    return this.server.call('user/create');
  });

  this.When(/^a user navigates to the login page, he can see the heading "([^"]*)"$/, function (heading) {
    return this.client.
      waitForExist('h3').
      getText('h3').should.become(heading);
  });

  this.When(/^fill the form and submit it$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return this.client.
      setValue('input[name="login-email"]', 'contact@pierre-mary.fr').
      setValue('input[name="login-password"]', 'mapker42').
      keys(['Enter']);
  });

  this.When(/^the user is logeded in, he can see the logout button$/, function (callback) {
    // Check if the logout button exist
    return this.client.
      waitForExist('#logout-btn').
      isExisting('#logout-btn');
  });

  this.When(/^he can access to his profile page$/, function (callback) {
    // Test if we can reach the profile page of the user
    return this.client.url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/bio');
  });

  this.Then(/^he should see his user name on his profile page$/, function (callback) {
    // Check if the username is well displayed
    return this.client.
      waitForExist('#user-name').
      waitForText('#user-name').
      getText('#user-name').then(function (text) {
        return expect(text).to.equal('PIERRE MARY');
      });
  });

  ///////////////////////////////////////////////////
  //  Scenario: Try to connect with invalide data  //
  ///////////////////////////////////////////////////
  this.Given(/^a user navigates to the login page, he can see the heading$/, function (heading) {
    return this.client.
      waitForExist('h3').
      getText('h3').should.become(heading);
  });

  this.When(/^he submit it without filled the field$/, function (callback) {
    return this.client.
      setValue('input[name="login-email"]', '').
      keys(['Enter']);
  });

  this.Then(/^he can see an error message below the email field "([^"]*)"$/, function (message) {
    return this.client.
      waitForExist('#login-email-help-block').
      waitForText('#login-email-help-block').
      getText('#login-email-help-block').then(function (text) {
        return expect(text).to.equal(message);
      });
  });

  this.Then(/^he can see an error message below the password field "([^"]*)"$/, function (message) {
    return this.client.
      waitForExist('#login-password-help-block').
      waitForText('#login-password-help-block').
      getText('#login-password-help-block').then(function (text) {
        return expect(text).to.equal(message);
      });
  });

  this.When(/^he submit the form with the email filled with "([^"]*)"$/, function (value) {
    return this.client.
      setValue('input[name="login-email"]', value).
      keys(['Enter']);
  });

  this.When(/^he submit the form with the password filled with "([^"]*)"$/, function (value) {
    return this.client.
      setValue('input[name="login-password"]', value).
      keys(['Enter']);
  });

  this.When(/^he submit valid data but the account doesn't exist$/, function (callback) {
    return this.client.
      setValue('input[name="login-email"]', 'valid@email.com').
      setValue('input[name="login-password"]', 'validPassword42').
      keys(['Enter']);
  });

  this.Then(/^he can see an error message with the text "([^"]*)"$/, function (message) {
    return this.client.
      waitForExist('.mapker-errors .alert:first-child .message').
      getText('.mapker-errors .alert:first-child .message').then(function (text) {
        return expect(text).to.equal(message);
      });
  });
};
