Template.UserProfileLayout.helpers({
});

Template.UserProfileLayout.onRendered = function(){
	console.log( this.findAll() );
	//this.find('#profile-avatar-bg').focusPoint();
};

Template.UserProfileLayout.events({
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload').css('display', 'inline-block');
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	'click #upload-avatar-btn': function(e, t) {
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
	}
});