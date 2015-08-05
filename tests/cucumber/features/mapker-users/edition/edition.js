module.exports = function () {

  //////////////
  //  Common  //
  //////////////
  this.Given(/^I have an account and not set my bio$/, function (callback) {
    return this.server.call('cucumber/user/create-with-no-bio');
  });

  this.Given(/^I'm loged in$/, function (callback) {
    return this.browser.
      url(process.env.ROOT_URL).
      executeAsync(function(done) {
        Meteor.loginWithPassword('contact@pierre-mary.fr', 'mapker42', done);
      });
  });

  ////////////////////////////////
  //  Scenario: Edit my bio  //
  ////////////////////////////////
  this.When(/^I go to my bio page$/, function (callback){
    return this.client.
      url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/bio').
      pause(500);
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

  ////////////////////////////////
  //  Scenario: Edit my skills  //
  ////////////////////////////////
  this.When(/^I go to my skills page and click on the "([^"]*)" element$/, function (selector) {
    return this.client.
      pause(1000).
      url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/skills').
      pause(500).
      waitForExist(selector).
      click(selector);
  });

  this.When(/^submit the skill "([^"]*)"$/, function (text) {
    return this.client.
      waitForExist('#input-skill').
      setValue('#input-skill', text).
      submitForm('#add-skill-form');
  });

  this.Then(/^I can see the skill "([^"]*)" in the list$/, function (value) {
    return this.client.
      pause(500).
      waitForExist('.user-skills .user-skill .skill-title').
      getText('.user-skills .user-skill .skill-title').then(function (text) {
        //console.log('text', text);
        //console.log('value', value);
        return expect(text).to.equal(value);
      });
  });

  this.When(/^I click on th edit button of a skill in the list, remove the only one and cancel$/, function (callback) {
    return this.client.
      click('.user-skills .user-skill:first-child').
      moveToObject('.user-skills .user-skill:first-child').
      click('.user-skills .user-skill:first-child .skill-edit').
      click('#edit-user-skills-form .user-skill:first-child .skill-remove').
      click('#edit-user-skills-form #cancel-edit-user-skills');
  });

  this.When(/^I click on th edit button of a skill in the list, remove the only one and save$/, function (callback) {
    return this.client.
      click('.user-skills .user-skill:first-child').
      moveToObject('.user-skills .user-skill:first-child').
      click('.user-skills .user-skill:first-child .skill-edit').
      click('#edit-user-skills-form .user-skill:first-child .skill-remove').
      submitForm('#edit-user-skills-form');
  });

  this.Then(/^my skills list should be empty$/,function (callback) {
    return this.client.getText('.user-skills').then(function (text) {
      return expect(text).to.equal('');
    });
  });

  this.When(/^I click on "([^"]*)" to open the form$/, function (selector) {
    return this.client
      .click(selector).
      waitForVisible('.identity-edition-popover');
  });
};
