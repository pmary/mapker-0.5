module.exports = function () {
  /////////////////////////
  //  Create an account  //
  /////////////////////////
  this.Given(/^I have created a sign up page with a sign up form$/, function (callback) {
    // Test if a route for /join exist
    //console.log(process.env.ROOT_URL + endpoint);
    return this.client.url(process.env.ROOT_URL + 'join');
  });

  this.When(/^a visitor navigates to the login page, he can see the heading "([^"]*)"$/, function (heading) {
    return this.client.
      waitForExist('h3').
      getText('h3').should.become(heading);
  });

  this.When(/^fill the form and submit it$/, function (callback) {
    return this.client.
      setValue('input[name="join-first-name"]', 'John').
      setValue('input[name="join-last-name"]', 'Doe').
      setValue('input[name="join-email"]', 'noreply@mapker.co').
      setValue('input[name="join-password"]', 'mapker42').
      setValue('input[name="join-confirm-password"]', 'mapker42').
      keys(['Enter']);
  });

  this.Then(/^he is redirected to his new profile page$/, function (callback) {
    return this.client.
      waitForExist('#user-name').
      waitForText('#user-name').
      getText('#user-name').then(function (text) {
        return expect(text).to.equal('JOHN DOE');
      });
  });

  //////////////////////////////////////////////////
  //  Try to create an account with invalid data  //
  //////////////////////////////////////////////////
  this.Given(/^I'm on the account creation page and I can see the heading "([^"]*)"$/, function (heading) {
    return this.client.url(process.env.ROOT_URL + 'join').
      waitForExist('h3').
      getText('h3').should.become(heading);
  });

  this.When(/^I submit the account creation form empty$/, function (callback) {
    return this.client.submitForm('#join-form');
  });

  this.Then(/^errors messages appear under all the fields$/, function (callback) {
    return this.client.
      waitForExist('#join-firstname-help-block').
      waitForText('#join-firstname-help-block').
      getText('#join-firstname-help-block').then(function (text) {
        return expect(text).to.equal("Required field");
      }).
      waitForExist('#join-lastname-help-block').
      waitForText('#join-lastname-help-block').
      getText('#join-lastname-help-block').then(function (text) {
        return expect(text).to.equal("Required field");
      }).
      waitForExist('#join-email-help-block').
      waitForText('#join-email-help-block').
      getText('#join-email-help-block').then(function (text) {
        return expect(text).to.equal("Email invalide");
      }).
      waitForExist('#join-password-help-block').
      waitForText('#join-password-help-block').
      getText('#join-password-help-block').then(function (text) {
        return expect(text).to.equal("Required field");
      });
  });

  this.When(/^I submit the account creation form firstname field with "([^"]*)"$/, function (value) {
    return this.client.
      setValue('input[name="join-first-name"]', value).
      submitForm('#join-form');
  });
};
