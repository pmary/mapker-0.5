Template.place_modalRemoveStaffMember.helpers({
  user: function () {
    return Session.get('userToRemoveFromStaff');
  }
});

Template.place_modalRemoveStaffMember.events({
  'click .admin-action-open-remove-staff-modal': function () {
    var placeId = Router.current().params._id;
    var user = Session.get('userToRemoveFromStaff');
    Meteor.call('place_adminRemoveStaffMember', placeId, user._id, function (err, res) {
      if (err) {
        console.log(err);
      }
      // Close the modal
      $('#myModal').modal('hide');

      // Remove the sessionv var
      delete Session.keys['userToRemoveFromStaff'];
    });
  }
});
