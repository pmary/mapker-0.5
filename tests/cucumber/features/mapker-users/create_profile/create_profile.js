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
    return this.browser.
      url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/bio');
  });

  this.Then(/^a modal open, with the following heading: "([^"]*)"$/, function (heading) {
    return this.client.
      execute(function () {
        // Disable jQuery animations
        $.fx.off = true;
        // Disable CSS animations
        $("<style type='text/css'>* { transition-property: none !important; -o-transition-property: none !important; -moz-transition-property: none !important; -ms-transition-property: none !important; -webkit-transition-property: none !important; transform: none !important; -o-transform: none !important; -moz-transform: none !important; -ms-transform: none !important; -webkit-transform: none !important; animation: none !important; -o-animation: none !important; -moz-animation: none !important; -ms-animation: none !important; -webkit-animation: none !important; }</style>").appendTo("head");
      }).
      waitForExist('h4.modal-title').
      waitForText('h4.modal-title').
      getText('h4.modal-title').then(function (text) {
        return text === heading;
      });
  });

  ////////////////////////////////////////
  //  Create a profile with right data  //
  ////////////////////////////////////////
  this.When(/^I fill and submit the form$/, function (heading) {
    return this.client.
      setValue('input[name="input-zipcode"]', '7500').
      setValue('.selectize-input > input', ''). // To focus on the input
      keys(['\uE003']).
      setValue('.selectize-input > input', 'Fra').
      keys(['\uE007']).
      setValue('input[name="input-activity"]', 'Testeur').
      addValue('input[name="input-zipcode"]', '2').
      waitUntil(function() {
        return this.getValue('#select-city').then(function(value) {
          return value === 'Paris';
        });
      }).
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
