focusPoint = function() {
  setTimeout(function() {
    $('#profile-cover-bg').focusPoint();
    $('.user-profile-places .place .cover').focusPoint();
  }, 100);
}

needToCreateProfile = function() {
  var params = this.params;
  var id = params._id;
  if (Meteor.user() && id == Meteor.user()._id) {
    var currentUser = Meteor.user();
    if (
      !currentUser.profile.activity
      || !currentUser.profile.address.countryCode
      || !currentUser.profile.address.zipcode
      || !currentUser.profile.address.city
      || !currentUser.profile.address.loc
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

setActiveMenuItem = function() {
  // Set the menu item as active
  $('#primary-navbar #main-menu li').removeClass('active');
  switch(this.url) {
    case '/search/places':
    break;

    case '/search/skills':
    break;

    default:

    break;
  }
}
Router.onAfterAction(setActiveMenuItem);