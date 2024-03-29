Template.modalLoginRequired.rendered = function () {
};

Template.modalLoginRequired.helpers({

});

Template.modalLoginRequired.events({
	"click .user-actions-join-btn": function () {
		// Redirect the user to the signup page
		Router.go('userJoin');
		// Close the modal
		Modal.hide('modalLoginRequired');
		// Scroll to top
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	},
	"click .user-actions-connect-btn": function (e) {
		e.preventDefault();
		// Redirect the user to the signup page
		Router.go('UserLogin');
		// Close the modal
		Modal.hide('modalLoginRequired');
		// Scroll to top
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	}
});
