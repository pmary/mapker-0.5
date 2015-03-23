Template.UserProfileLayout.events({
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	}
});

Template.UserProfileLayout.rendered = function(e, t){
};

Template.UserProfileLayout.events({
	'click .upload-cover-btn' : function(e, t){
		console.log("Clocj");
	}
});