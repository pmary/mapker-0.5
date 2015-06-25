Template.modalPlaceInviteStaffMembers.helpers({
  usersSelected: function () {
    return Session.get('currentStaffUsersSelected');
  },
  errorMessage: function(field) {
    return Session.get('modalAddPlaceInviteStaffMembersErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('modalAddPlaceInviteStaffMembersErrors')[field] ? 'has-error' : '';
  }
});

Template.modalPlaceInviteStaffMembers.rendered = function () {
  // Clear the session var
  Session.set('currentStaffUsersSelected', null);

  // Get the user network
  var userNetwork = Meteor.user().profile.network.users.followed.concat(Meteor.user().profile.network.users.followers);

  /**
   * @summary AutoComplete init. for the users input field
   * @see https://github.com/devbridge/jQuery-Autocomplete
   * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
   */
  //this.autorun(function () {
    var currentQueryString;
    $('.modal-place-invite-staff-members #input-who').autocomplete({
      position: "absolute",
      appendTo: $('.modal-place-invite-staff-members #input-who-container'),
      lookup: function(queryString, done) {
        // No search if the query string lenght < 2 characters
        // Or if the input text hasn't change
        if (queryString.length < 2 || queryString == currentQueryString) return;
        currentQueryString = queryString;

        // Get the suggestions according to the queryString
        Meteor.call('getUsersByFullname', {string: queryString, network: userNetwork}, function(error, result) {
          // Display the error to the user and abort
          if (error) return console.log(error.reason);

          formatedResult = {
            suggestions: $.map(result, function(dataItem) {
              // Check if the user has already be selected
              var usersSelected = Session.get('currentStaffUsersSelected');
              if (usersSelected) {
                for (var i = 0; i < usersSelected.length; i++) {
                  if (usersSelected[i].id == dataItem._id)
                    return;
                };
              };
              return { value: dataItem._source.name, data: dataItem._id };
            })
          };

          done(formatedResult);
        });
      },
      // Called before displaying the suggestions. You may manipulate suggestions DOM before it is displayed.
      beforeRender: function (container) {
        /*console.log($(container)[0]);
        container[0].innerHTML = '<div><em>Hello</em></div>';*/
      },
      onSelect: function (suggestion) {
        $('.modal-place-invite-staff-members #input-who').val('');
        //console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
        var usersSelected = Session.get('currentStaffUsersSelected');

        if (! usersSelected)
          usersSelected = [{ fullname: suggestion.value, id: suggestion.data }];
        else
          usersSelected.push({ fullname: suggestion.value, id: suggestion.data });

        Session.set('currentStaffUsersSelected', usersSelected);
      }
    });
  //});
};

Template.modalPlaceInviteStaffMembers.events({
  /**
   * @summary Check if the input is a valid email address
   */
  'submit .staff-invitation-form': function (e, t) {
    e.preventDefault();
    var email = t.find('#input-who').value,
    errors = {};

    // Check if the input is a valid email address
    var emailError = emailValidation(email);
    if (emailError) 
      var errors = { email: emailError };
    Session.set('modalAddPlaceInviteStaffMembersErrors', errors);
    if (Object.keys(errors).length) {
      Meteor.setTimeout(function () {
        Session.set('modalAddPlaceInviteStaffMembersErrors', '');
      }, 3000);
      return;
    }

    t.find('#input-who').value = '';

    // Add the email to the list
    var usersSelected = Session.get('currentStaffUsersSelected');
    if (! usersSelected)
      usersSelected = [{ email: email, id: email }];
    else
      usersSelected.push({ email: email, id: email });

    Session.set('currentStaffUsersSelected', usersSelected);
    
  },
  /**
   * @summary Remove a user from the invitation list
   */
  'click .user-action-remove-user-selected': function (e, t) {
    // Remove the selected user from the list
    var userId = this.id;
    var usersSelected = Session.get('currentStaffUsersSelected');

    for (var i = 0; i < usersSelected.length; i++) {
      if ( usersSelected[i].id == userId) {
        usersSelected.splice(i, 1);
      }
    };
    Session.set('currentStaffUsersSelected', usersSelected);
  },
  /**
   * @summary Send an invitation email to the users in the list
   */
  'click .user-action-send-invitations': function (e, t) {
    var usersSelected = Session.get('currentStaffUsersSelected');
    console.log('usersSelected', usersSelected);
    if (usersSelected) {
      Meteor.call('inviteStaffMembers', usersSelected, function(error, result) {

      });
    };
  }
});