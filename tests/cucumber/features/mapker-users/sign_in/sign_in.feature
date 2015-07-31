Feature: Sign in form

  As a visitor
  I want to create an account
  So that I can perform actions that require to be logged on

    @dev
    Scenario: Create an account
      Given I have created a sign up page with a sign up form
      When a visitor navigates to the login page, he can see the heading "Sign Up"
      And fill the form and submit it
      Then he is redirected to his new profile page

    @dev
    Scenario: Try to create an account with invalid data
      Given I'm on the account creation page and I can see the heading "Sign Up"
      When I submit the account creation form empty
      Then errors messages appear under all the fields
      When I submit the account creation form firstname field with "2"
