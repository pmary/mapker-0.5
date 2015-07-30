Feature: Sign in form

  As a visitor
  I want to create an account
  So that I can perform actions that require to be logged on

    Scenario: Create an account
      Given I have created a sign up page with a sign up form
      When a visitor navigates to the login page, he can see the heading "Sign Up"
      And fill the form and submit it
      Then he is redirected to his new profile page
