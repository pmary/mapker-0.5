module.exports = function () {

  //////////////
  //  Common  //
  //////////////
  this.Given(/^I have an account and not set my activity countryCode zipcode city or loc$/, function (callback) {
    return this.server.call('cucumber/user/create-with-no-profile');
  });

  this.Given(/^I'm loged in$/, function (callback) {
    return this.browser.
      url(process.env.ROOT_URL).
      executeAsync(function(done) {
        Meteor.loginWithPassword('contact@pierre-mary.fr', 'mapker42', done);
      });
  });

  this.Then(/^it redirect me to my profile page$/, function (callback) {
    return this.client.
      waitForExist('#user-name').
      waitForText('#user-name').
      getText('#user-name').then(function (text) {
        return expect(text).to.equal('PIERRE MARY');
      });
  });

  this.Then(/^a modal open, with the following heading: "([^"]*)"$/, function (heading) {
    return this.client.
      pause(500).
      waitForExist('h4.modal-title', 5000).
      getText('h4.modal-title').should.become(heading);
  });

  ////////////////////////////////////////
  //  Create a profile with right data  //
  ////////////////////////////////////////
  this.When(/^I fill and submit the form$/, function (heading) {
    return this.client.
      setValue('input[name="input-zipcode"]', '7500').
      selectByValue('#select-country', 'FR').
      setValue('input[name="input-activity"]', 'Testeur').
      pause(1000).
      addValue('input[name="input-zipcode"]', '2').
      pause(2000).
      selectByIndex('#select-city', 0).
      submitForm('#create-profile-form');
  });

  this.Then(/^My informations should be updated on my profile$/, function (heading) {
    return this.client.
      waitForExist('#user-activity').
      waitForText('#user-activity').
      getText('#user-activity').then(function (text) {
        return expect(text).to.equal('Testeur');
      }).
      waitForExist('#user-area').
      waitForText('#user-area').
      getText('#user-area').then(function (text) {
        return text === 'Paris';
      });
  });

  ////////////////////////////////////////
  //  Create a profile with wrong data  //
  ////////////////////////////////////////
  this.When(/^I submit the profil creation form empty$/, function (callback) {
    return this.client.submitForm('#create-profile-form');
  });

  this.Then(/^I can see the message "([^"]*)" under the main activity, zip code and city fields$/, function (message) {
    return this.client.
      waitForExist('#input-activity-help-block').
      waitForText('#input-activity-help-block').
      getText('#input-activity-help-block').then(function (text) {
        return expect(text).to.equal(message);
      }).
      waitForExist('#input-zipcode-help-block').
      waitForText('#input-zipcode-help-block').
      getText('#input-zipcode-help-block').then(function (text) {
        return expect(text).to.equal(message);
      }).
      waitForExist('#select-city-help-block').
      waitForText('#select-city-help-block').
      getText('#select-city-help-block').then(function (text) {
        return expect(text).to.equal(message);
      });
  });
};
