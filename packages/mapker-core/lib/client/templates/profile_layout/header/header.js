/**
 * @description
 * Set the 'modalResource' session variable with the data related
 * to the current resource
 *
 * @param {Object} t The current template instance object
 */
var setModalData = function(t) {
	//console.log(t);
	var resource = {
		id: t.data.data._id, // User id
		cover: t.data.data.profile.cover,
		avatar: t.data.data.profile.avatar,
		type: t.data.type
	};
	Session.set('modalResource', resource);
};

Template.coreProfileheader.events({
  /**
   * @description
   * Open the modal to edit the cover
   */
  'click .profile-header-action-edit-cover': function(e, t){
		// Open the cover change modal
    Modal.show('modalChangeCover', setModalData(t));
		/*
		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');*/
	},
  /**
   * @description
   * Open the modal to edit the cover
   */
	'click .profile-header-action-edit-avatar': function(e, t) {
    Modal.show('modalChangeAvatar', setModalData(t));
	}
});
