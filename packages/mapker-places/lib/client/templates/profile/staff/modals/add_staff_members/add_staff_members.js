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

  var userNetwork = [];

  // Get the user network
  if (Meteor.user() && Meteor.user().profile.network && Meteor.user().profile.network.users && Meteor.user().profile.network.users.connected) {
    userNetwork = Meteor.user().profile.network.users.connected;
  }
  // Add the current user id to userNetwork to allow him to add himself if he is not member of the statff
  userNetwork.push( Meteor.user()._id );

  // Get the place staff members
  var place = Places.findOne({_id: Router.current().params._id, members: {$elemMatch: { staff: true }}}, {fields: {members: 1}});
  var exculdedIds = [];
  if (place && place.members) {
    var members = place.members;
    // Filter the staff members
    var staffMembersIds = [];
    for (var i = 0; i < members.length; i++) {
      if (members[i].staff)
        staffMembersIds.push(members[i].id);
    }

    // Exclude the staff members from the search
    exculdedIds = staffMembersIds;
    console.log('exculdedIds', exculdedIds);
  }

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
        if (queryString.length < 2 || queryString === currentQueryString) return;
        currentQueryString = queryString;

        // Get the suggestions according to the queryString
        Meteor.call('getUsersByFullname', {string: queryString, network: userNetwork, exculdedIds: exculdedIds}, function(error, result) {
          // Display the error to the user and abort
          if (error) return console.log(error.reason);

          var formatedResult = {
            suggestions: $.map(result, function(dataItem) {
              // Check if the user has already be selected
              var usersSelected = Session.get('currentStaffUsersSelected');
              if (usersSelected) {
                for (var i = 0; i < usersSelected.length; i++) {
                  if (usersSelected[i].id === dataItem._id)
                    return;
                }
              }
              return { value: dataItem._source.name, data: dataItem._id };
            })
          };

          done(formatedResult);
        });
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
   * @summary Remove a user from the invitation list
   */
  'click .user-action-remove-user-selected': function () {
    // Remove the selected user from the list
    var userId = this.id;
    var usersSelected = Session.get('currentStaffUsersSelected');

    for (var i = 0; i < usersSelected.length; i++) {
      if (usersSelected[i].id === userId) {
        usersSelected.splice(i, 1);
      }
    }
    Session.set('currentStaffUsersSelected', usersSelected);
  },
  /**
   * @summary Send an invitation email to the users in the list
   */
  'click .user-action-send-invitations': function (e, t) {
    var usersSelected = Session.get('currentStaffUsersSelected'),
    message = t.find('#input-message').value,
    placeId = Router.current().params._id;
    console.log('message', message);

    if (usersSelected) {
      Meteor.call('invitePlaceStaffMembers', usersSelected, placeId, message, function(error, result) {
        if (error) console.log(error);
        console.log(result);
        $('#myModal').modal('hide');
      });
    }
  }
});
