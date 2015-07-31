Feature: Login system

  As a user
  I want to be connected with my account
  So that I can perform actions that require to be logged on

    @dev
    Scenario: Connect to an existing account
      Given I have created a login page with a login form
      And a user has created an account
      When a user go to the login page, he can see the heading "Sign In"
      And fill the eamil and password fields and submit the form
      When the user is logeded in, he can see the logout button
      And he can access to his profile page
      Then he should see his user name on his profile page

    @dev
    Scenario: Try to connect with invalide data
      Given I have created a login page with a login form
      And a user navigates to the login page, he can see the heading "Sign In"
      When he submit it without filled the field
      Then he can see an error message below the email field "Email invalide"
      And he can see an error message below the password field "Required field"
      # Try email field 1
      When he submit the form with the email filled with "a"
      Then he can see an error message below the email field "Email invalide"
      # Try email field 2
      When he submit the form with the email filled with "aa@"
      Then he can see an error message below the email field "Email invalide"
      # Try email field 3
      When he submit the form with the email filled with "aa@.fr"
      Then he can see an error message below the email field "Email invalide"
      # Try email field 4
      When he submit the form with the email filled with "aa@ze.f"
      Then he can see an error message below the email field "Email invalide"
      # Try with valid data but for an inexisting account
      When he submit valid data but the account doesn't exist
      Then he can see an error message with the text "Invalid login or password"
