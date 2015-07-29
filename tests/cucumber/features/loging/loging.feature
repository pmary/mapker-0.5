Feature: Login system

  As a user
  I want to be connected with my account
  So that I can perform actions that require to be logged on

    @dev
    Scenario: Connect to an existing account
      Given I have created a login page with a login form
      And a user has created an account
      When a user navigates to the login page, he can see the heading "Sign In"
      And fill the form and submit it
      When the user is logeded in, he can see the logout button
      And he can access to his profile page
      Then he should see his user name on his profile page
