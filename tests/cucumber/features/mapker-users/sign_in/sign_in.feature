Feature: Sign in form

  As a visitor
  I want to create an account
  So that I can perform actions that require to be logged on

    #@dev
    Scenario: Create an account
      Given I have created a sign up page with a sign up form
      When a visitor navigates to the login page, he can see the heading "Sign Up"
      And fill the form and submit it
      Then he is redirected to his new profile page

    Scenario: Try to create an account with invalid data
      Given I'm on the account creation page and I can see the heading "Sign Up"
      When I submit the account creation form empty
      Then errors messages appear under all the fields
      # Firstname
      When I submit the account creation with "input[name='join-first-name']" filled with "2"
      Then I should see the following message under the firstname field "#join-firstname-help-block" "This field must contain at least 2 characters"
      When I submit the account creation with "input[name='join-first-name']" filled with "2e"
      Then I should see the following message under the firstname field "#join-firstname-help-block" "This field should not contain digit"
      # Lastname
      When I submit the account creation with "input[name='join-last-name']" filled with "2"
      Then I should see the following message under the firstname field "#join-lastname-help-block" "This field must contain at least 2 characters"
      When I submit the account creation with "input[name='join-last-name']" filled with "2e"
      Then I should see the following message under the firstname field "#join-lastname-help-block" "This field should not contain digit"
      # Email
      When I submit the account creation with "input[name='join-email']" filled with "a"
      Then I should see the following message under the firstname field "#join-email-help-block" "Email invalide"
      When I submit the account creation with "input[name='join-email']" filled with "aa@"
      Then I should see the following message under the firstname field "#join-email-help-block" "Email invalide"
      When I submit the account creation with "input[name='join-email']" filled with "aa@.fr"
      Then I should see the following message under the firstname field "#join-email-help-block" "Email invalide"
      When I submit the account creation with "input[name='join-email']" filled with "aa@&.fr"
      Then I should see the following message under the firstname field "#join-email-help-block" "Email invalide"
      When I submit the account creation with "input[name='join-email']" filled with "aa@a.f"
      Then I should see the following message under the firstname field "#join-email-help-block" "Email invalide"
      # Password
      When I submit the account creation with "input[name='join-password']" filled with "a"
      Then I should see the following message under the firstname field "#join-password-help-block" "This field must contain at least 6 characters"
      When I submit the account creation with "input[name='join-password']" filled with "abcdef"
      Then I should see the following message under the firstname field "#join-password-help-block" "Your password must contain at least one digit"
      When I submit the account creation with "input[name='join-password']" filled with "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijk"
      Then I should see the following message under the firstname field "#join-password-help-block" "This field must not contain more than 50 characters"
      When I submit the account creation with "input[name='join-password']" filled with "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijk"
      Then I should see the following message under the firstname field "#join-password-help-block" "This field must not contain more than 50 characters"
      When I submit the account creation with "input[name='join-confirm-password']" filled with "a"
      Then I should see the following message under the firstname field "#join-passwordConfirmation-help-block" "Password and confirmation doesn't match"
