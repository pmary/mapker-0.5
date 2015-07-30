module.exports = function () {
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
};
