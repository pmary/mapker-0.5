focusPoint = function() {
  setTimeout(function() {
    $('#profile-avatar-bg').focusPoint();
    $('#profile-cover-bg').focusPoint();
    $('.user-profile-places .place .cover').focusPoint();
    $('.user-profile-places .place .avatar').focusPoint();
  }, 100);
}

needToCreateProfile = function() {
  var params = this.params;
  var id = params._id;
  if (Meteor.user() && id == Meteor.user()._id) {
    var currentUser = Meteor.user();
    if (
      !currentUser.profile.activity
      || !currentUser.profile.countryCode
      || !currentUser.profile.zipcode
    ) {
      Session.set('modalCreateProfileErrors', {});
          
      //console.log("Open modal " + t.$(event.target).data('modal-template'));
      // Open the create profile modal
      Session.set('activeModal', "modalCreateProfile");

      $('#myModal').modal({
        backdrop: 'static',
          keyboard: false
      });
    };
  };
}