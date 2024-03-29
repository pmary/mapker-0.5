module.exports = function () {

  //////////////
  //  Common  //
  //////////////
  this.Given(/^I have an account and not set my bio$/, function (callback) {
    return this.server.call('cucumber/user/create-with-no-bio');
  });

  this.Given(/^I'm loged in$/, function (callback) {
    this.browser.
      url(process.env.ROOT_URL).
      executeAsync(function(done) {
        Meteor.loginWithPassword('contact@pierre-mary.fr', 'mapker42', done);
      }).then(function (res) {
        if (res.state === 'success') {
          callback();
        }
      });
  });

  /////////////////////////////
  //  Scenario: Edit my bio  //
  /////////////////////////////
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
  this.When(/^I go to my skills page and click on the "([^"]*)" element$/, function (selector, callback) {
    this.client.
      url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/skills').
      pause(1000).
      waitForExist(selector).
      click(selector).
      waitForVisible('.user-add-bio-form').then(function (res) {
        //console.log('^I go to my skills page and... res: ', res);
        if (res) {
          callback();
        }
      });
  });

  this.When(/^submit the skill "([^"]*)"$/, function (text, callback) {
    this.client.
      waitForExist('input[name="input-skill"]').
      setValue('input[name="input-skill"]', text).
      submitForm('#add-skill-form').then(function (res) {
        if (res.state === 'success') {
          callback();
        }
      });
  });

  /////////////////////////////////////////////////
  //  Edit my name and activity with valid data  //
  /////////////////////////////////////////////////
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

  this.When(/^I go to my profile and click on "([^"]*)" to open the form$/, function (selector) {
    return this.client.
      url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/bio').
      waitForExist(selector).
      click(selector).
      waitForVisible('.identity-edition-popover');
  });

  this.When(/^enter "([^"]*)" as firstname, "([^"]*)" as lastname and "([^"]*)" as activity and submit$/, function (firstname, lastname, activity) {
    return this.client.
      setValue('input[name="edit-first-name"]', firstname).
      setValue('input[name="edit-last-name"]', lastname).
      setValue('input[name="edit-activity"]', activity).
      submitForm('#identity-form');
  });

  this.Then(/^I can see that my name and activity has changed accordingly$/, function (callback) {
    //console.log('Will lokk for Developer');
    return this.client.
      waitUntil(function() {
        return this.getText('#user-name').then(function (text) {
          //console.log('text', text);
          return text === 'JOHN DOE';
        });
      }).
      waitUntil(function() {
        return this.getText('#user-activity').then(function (text) {
          //console.log('text', text);
          return text === 'Blacksmith';
        });
      });
  });

  /////////////////////////////////////////////////
  //  Edit my name and activity with wrong data  //
  /////////////////////////////////////////////////
  this.When(/^enter "([^"]*)" in the field "([^"]*)" and submit$/, function (value, fieldSelector, callback) {
    this.client.
      setValue(fieldSelector, value).
      submitForm('#identity-form').then(function (res) {
        if (res.state === 'success') {
          callback();
        }
      });
  });

  this.Then(/^I can read the text "([^"]*)" in "([^"]*)"$/, function (textToFind, selector, callback) {
    //console.log('I can read the text ', textToFind);
    return this.client.
      waitForExist(selector).
      waitUntil(function() {
        return this.getText(selector).then(function (text) {
          //console.log('text', text);
          return text === textToFind;
        });
      });
  });

  ///////////////////////////////////////////
  //  Upload a cover for the first time  //
  ///////////////////////////////////////////
  this.Given(/^I have an account and no avatar or cover$/, function () { 
    return this.server.call('cucumber/user/create-with-no-avatar-or-cover');
  });

  this.When(/^I open the avatar upload form$/, function (callback) {
    return this.client.
      url(process.env.ROOT_URL + 'user/i4FxWHYGyQr3LyN4x/bio').
      waitForExist('.profile-cover').
      execute(function () {
        $('.profile-page .profile-cover .upload-cover-btn').css('display', 'block');
      }).
      click('.profile-cover .upload-cover-btn').
      waitForVisible('#myModal');
  });

  this.When(/^I upload a file and save$/, function (callback) {
    return this.client.
      chooseFile('.modal-change-cover #input-cover', process.env.PWD + '/tests/cucumber/fixtures/images/cover.jpg').
      click('#save-cover');
  });

  //.sendKeys("localPath");
};
