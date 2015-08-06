Feature: Edit user informations

  As a user
  I want to edit my profile

    #@dev
    Scenario: Edit my bio
      Given I have an account and not set my bio
      And I'm loged in
      When I go to my bio page
      And I click on the "#update-user-bio" element and type "Hello bio" and submit the form
      Then my bio is updated and I can see the text "Hello bio"
      When I click on the "#update-user-bio" element and type "Hello again" and submit the form
      Then my bio is updated and I can see the text "Hello again"
      When I click on the "#update-user-bio" element and type "" and submit the form
      Then I can see the text "Talk about you" in the ".text-add-bio" element

    #@dev
    Scenario: Edit my skills
      Given I have an account and not set my bio
      And I'm loged in
      When I go to my skills page and click on the ".user-add-bio-message" element
      And submit the skill "Developer"
      Then I can read the text "Developer" in ".user-skills .user-skill:first-child .skill-title"
      When I click on th edit button of a skill in the list, remove the only one and cancel
      Then I can read the text "Developer" in ".user-skills .user-skill:first-child .skill-title"
      When I click on th edit button of a skill in the list, remove the only one and save
      Then my skills list should be empty

    #@dev
    Scenario: Edit my name and activity with valid data
      Given I have an account and not set my bio
      And I'm loged in
      When I go to my profile and click on ".open-identity-edition-popover" to open the form
      And enter "John" as firstname, "Doe" as lastname and "Blacksmith" as activity and submit
      Then I can see that my name and activity has changed accordingly

    #@dev
    Scenario: Edit my name and activity with wrong data
      Given I have an account and not set my bio
      And I'm loged in
      When I go to my profile and click on ".open-identity-edition-popover" to open the form
      # Firstname field test
      And enter "J" in the field "input[name='edit-first-name']" and submit
      Then I can read the text "This field must contain at least 2 characters" in "#first-name-help-block"
      And enter "J2" in the field "input[name='edit-first-name']" and submit
      Then I can read the text "This field should not contain digit" in "#first-name-help-block"
      And enter "azertyuiopazertyuiopazertyuiopazertyuiopazertyuiopc" in the field "input[name='edit-first-name']" and submit
      Then I can read the text "This field must not contain more than 50 characters" in "#first-name-help-block"
      And enter "John@" in the field "input[name='edit-first-name']" and submit
      Then I can read the text "Invalid character in the user name" in "#first-name-help-block"
      # Lastname field test
      When enter "J" in the field "input[name='edit-last-name']" and submit
      Then I can read the text "This field must contain at least 2 characters" in "#last-name-help-block"
      And enter "J2" in the field "input[name='edit-last-name']" and submit
      Then I can read the text "This field should not contain digit" in "#last-name-help-block"
      And enter "azertyuiopazertyuiopazertyuiopazertyuiopazertyuiopc" in the field "input[name='edit-last-name']" and submit
      Then I can read the text "This field must not contain more than 50 characters" in "#last-name-help-block"
      And enter "John@" in the field "input[name='edit-last-name']" and submit
      Then I can read the text "Invalid character in the user name" in "#last-name-help-block"
      # Activity
      When enter " " in the field "input[name='edit-activity']" and submit
      Then I can read the text "Required field" in "#activity-help-block"
