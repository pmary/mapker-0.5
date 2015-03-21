Template.modal.created = function() {
}

Template.modal.helpers({  
	activeModal: function() {
		return Session.get('activeModal');
	}
});