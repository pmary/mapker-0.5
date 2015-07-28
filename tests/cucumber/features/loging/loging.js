module.exports = function () {

  this.Given(/^I have created a login page with a login form$/, function (callback) {
    // Test if a route for /login exist
    return this.client.url(process.env.ROOT_URL + 'login');
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

  this.Then(/^he should be redirected to hise profile page$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    //console.log( 'this.driver.getCurrentUrl()', this.driver.getCurrentUrl() );
    console.log('hello');
    //return this.driver.
      //getCurrentUrl();
  });

};
