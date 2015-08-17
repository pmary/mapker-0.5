Template.place_modalLeaveStaff.events({
  /**
	 * @summary Remove the user from the staff
	 */
  'click .user-action-leave-place-staff': function (e, t) {
    var placeId = Router.current().params._id;
    Meteor.call('place_userLeaveStaff', placeId, function (err, res) {
      if (err) {
        console.log(err);
      }
      // Close the modal
      $('#myModal').modal('hide');
    });
  }
});
