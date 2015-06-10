Template.primaryNavbar.helpers({
});

Template.primaryNavbar.rendered = function() {
	// initialize all tooltips
	$('#primary-navbar [data-toggle="tooltip"]').tooltip();
	this.autorun(function() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-50726930-1', 'auto');
		  ga('send', 'pageview');
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