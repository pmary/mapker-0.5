Feature: Login system

  As a user
  I want to be connected with my account
  So that I can perform actions that require to be logged on

    @dev
    Scenario: Connect to an existing account
      Given I have created a login page with a login form
      When a user navigates to the login page, he can see the heading "Sign In"
      And fill the form and submit it
      Then he should be redirected to hise profile page
