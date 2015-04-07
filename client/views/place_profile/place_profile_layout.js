Template.placeProfileLayout.helpers({
	isAdmin: function() {
		if (this.place.administrators.indexOf(Meteor.user()._id) > -1) {
			return true;
		}
		else {
			return false;
		};
	}
});

Template.placeProfileLayout.onRendered = function(){

};

Template.placeProfileLayout.events({
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	'click #upload-avatar-btn': function(e, t) {
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		var resource = {
			_id: t.data.place._id,
			cover: t.data.place.cover,
			logo: t.data.place.avatar,
			type: 'place'
		}
		Session.set('modalAvatarResource', resource);
		// Init focuspoint
		$('#helper-tool-container').jQueryFocuspointHelpertool();
	}
});