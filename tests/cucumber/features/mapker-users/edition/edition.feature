Feature: Edit user informations

  As a user
  I want to edit my profile

    Scenario: Edit my bio
      Given I have an account and not set my bio
      And I'm loged in
      When I click on the "#update-user-bio" element and type "Hello bio" and submit the form
      Then my bio is updated and I can see the text "Hello bio"
      When I click on the "#update-user-bio" element and type "Hello again" and submit the form
      Then my bio is updated and I can see the text "Hello again"
      When I click on the "#update-user-bio" element and type "" and submit the form
      Then I can see the text "Talk about you" in the "#update-user-bio" element
