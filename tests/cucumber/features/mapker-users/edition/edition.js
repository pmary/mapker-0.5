module.exports = function () {

  //////////////
  //  Common  //
  //////////////
  this.Given(/^I have an account and not set my bio$/, function (callback) {
    return this.server.call('cucumber/user/create-with-no-bio');
  });

  this.Given(/^I'm loged in$/, function (callback) {
    return this.client.url(process.env.ROOT_URL + 'login').
      waitForExist('h3').
      setValue('input[name="login-email"]', 'contact@pierre-mary.fr').
      setValue('input[name="login-password"]', 'mapker42').
      keys(['Enter']);
  });

  this.When(/^I click on the "([^"]*)" element and type "([^"]*)" and submit the form$/, function (selector, text) {
    return this.client.
      waitForExist('.user-profile-bio').
      click(selector).
      waitForExist('#input-user-bio').
      setValue('#input-user-bio', text).
      submitForm('#form-user-bio');
  });

  this.Then(/^my bio is updated and I can see the text "([^"]*)"$/, function (bioText) {
    return this.client.
      waitForExist('.user-bio-content').
      getText('.user-bio-content').then(function (text) {
        return expect(text).to.equal(bioText + '\nEdit');
      });
  });

  this.Then(/^I can see the text "([^"]*)" in the "([^"]*)" element$/, function (text, selector) {
    return this.client.
      getText(selector).then(function (text) {
        return expect(text).to.equal('Talk about you');
      });
  });
}
