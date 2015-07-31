Feature: Create a profile

  As a new user
  I go to my profile page and I have not yet created my profile
  So that a modal with a form is display for that

    #@dev
    Scenario: Create a profile with right data
      Given I have an account and not set my activity countryCode zipcode city or loc
      And I'm loged in
      Then it redirect me to my profile page
      And a modal open, with the following heading: "Create your profile"
      When I fill and submit the form
      Then My informations should be updated on my profile

    @dev
    Scenario: Create a profile with wrong data
      Given I have an account and not set my activity countryCode zipcode city or loc
      And I'm loged in
      Then it redirect me to my profile page
      And a modal open, with the following heading: "Create your profile"
      When I submit the profil creation form empty
      Then I can see the message "Required field" under the main activity, zip code and city fields
