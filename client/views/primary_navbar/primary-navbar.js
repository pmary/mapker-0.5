Template.primaryNavbar.helpers({
	// Check if we are on the search page and if yes, hide the navbar search form
	hideSearch: function() {		
		console.log(Router.current().route._path);
		if (Router.current() && Router.current().route._path == '/search')
			return true
		else
			return false
	}
});

Template.primaryNavbar.events({
	'click #modal-add-place' : function(e, t){
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalAddPlaceErrors', {});
		
		//console.log("Open modal " + t.$(event.target).data('modal-template'));
		// Open the add place modal
		var name = t.$(event.target).data('modal-template');
		Session.set('activeModal', name);
	},
	'submit #navbar-search': function(e,t) {
		e.preventDefault();
		Session.set('searchTerms', t.find('#navbar-input-search').value);
		t.find('#navbar-input-search').value = "";
		Router.go('search');
	}
});