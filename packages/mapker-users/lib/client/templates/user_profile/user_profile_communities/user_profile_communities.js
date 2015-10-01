Template.userProfileCommunities.rendered = function(){
  // Set the tab as active
  $('.user-profile-page .nav li').removeClass('active');
  $('.user-profile-page .nav li#nav-communities').addClass('active');
};

Template.userProfileCommunities.helpers({
  hasCommunities: function(field) {
		return Communities.find().count();
	}
});

Template.userProfileCommunities.events({
  'click .user-go-communities-search': function () {
    //Router.go('searchSkills');
  }
});
