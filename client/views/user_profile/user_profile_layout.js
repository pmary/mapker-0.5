Template.UserProfileLayout.helpers({
});

Template.UserProfileLayout.onRendered = function(){
	console.log( this.findAll() );
	//this.find('#profile-avatar-bg').focusPoint();
};

var setModalData = function(t) {
	var resource = {
		id: t.data.user._id, // User id
		cover: t.data.user.profile.cover,
		logo: t.data.user.profile.avatar,
		type: 'user'
	}
	Session.set('modalResource', resource);
}

Template.UserProfileLayout.events({
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');
		setModalData(t);

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	'click #upload-avatar-btn': function(e, t) {
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		setModalData(t);

		// Init focuspoint
		$('#helper-tool-container').jQueryFocuspointHelpertool();
	}
});