module.exports = function () {
  this.Given(/^I have an account and not set my activity countryCode zipcode city or loc$/, function (callback) {
    return this.server.call('cucumber/user/create-with-no-profile');
  });

  this.Given(/^I'm loged in$/, function (callback) {
    return this.client.url(process.env.ROOT_URL + 'login').
      waitForExist('h3').
      setValue('input[name="login-email"]', 'contact@pierre-mary.fr').
      setValue('input[name="login-password"]', 'mapker42').
      keys(['Enter']);
    /*var login = this.client.call('cucumber/login');
    console.log(JSON.stringify(login));
    return login;*/
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
      waitForExist('h4.modal-title', 5000).
      getText('h4.modal-title').should.become(heading);
  });

  this.When(/^I fill and submit the form$/, function (heading) {
    var self = this;
    return this.client.
      selectByValue('#select-country', 'FR').
      setValue('input[name="input-zipcode"]', '75002').
      waitUntil(function() {
        return this.getText('#select-city option:first-child').then(function(text) {
          //console.log('text', text);
          if (text === 'Paris') {
            return self.client.selectByValue('#select-city', 'Paris').
              setValue('input[name="input-activity"]', 'Testeur').
              click('.modal-create-profile .modal-footer input[type="submit"]');
          }
        });
      }, 5000);
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
        return expect(text).to.equal('Paris');
      });
  });
}
