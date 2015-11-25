Template.userProfileEvents.rendered = function(){
  // Set the tab as active
  $('.user-profile-page .nav li').removeClass('active');
  $('.user-profile-page .nav li#nav-events').addClass('active');
};

Template.userProfileEvents.helpers({
  hasEvents: function(field) {
		return Events.find().count();
	}
});

Template.userProfileEvents.events({
  'click .user-go-events-search': function () {
    Router.go('searchEvents');
  }
});
