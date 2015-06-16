Template.primaryNavbar.helpers({
});

Template.primaryNavbar.rendered = function() {
	// initialize all tooltips
	$('#primary-navbar [data-toggle="tooltip"]').tooltip();
	this.autorun(function() {
		
	});
}

Template.primaryNavbar.events({
	'click #modal-add-place' : function(e, t){
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalAddPlaceErrors', {});
		
		//console.log("Open modal " + t.$(event.target).data('modal-template'));
		// Open the add place modal
		Session.set('activeModal', 'modalAddPlace');
		$('#myModal').modal();
	}
});