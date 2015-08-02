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

    @dev
    Scenario: Edit my skills
      Given I have an account and not set my bio
      And I'm loged in
      When I go to my skills page
      And submit the skill "Developer"
      Then I can see the skill "Developer" in the list
      When I click on th edit button of a skill in the list, remove the only one and cancel
      Then I can see the skill "Developer" in the list
      When I click on th edit button of a skill in the list, remove the only one and save
      Then my skills list should be empty