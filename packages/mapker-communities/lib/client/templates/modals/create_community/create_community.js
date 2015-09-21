Template.modalCreateCommunity.helpers({
	errorMessage: function (field) {
		if (Session.get('modalCreatePlaceErrors')) {
			return Session.get('modalCreatePlaceErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('modalCreatePlaceErrors')) {
			return !!Session.get('modalCreatePlaceErrors')[field] ? 'has-error' : '';
		}
	}
});

Template.modalCreateCommunity.rendered = function () {
	$('.modal-create-community [data-toggle="popover"]').popover();
};

Template.modalCreateCommunity.events({
  'keyup #input-name': function (e, t) {
    var name = t.find('#input-name').value;

    // Remove special chars and replace spaces by '_'
    t.find('#input-username').value = name.replace(/[^\w\s]/gi, '').replace(/\s/g, '_');
  }
});
