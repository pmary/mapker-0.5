Template.UserProfileBio.events({
	'click #update-user-bio' : function(e, t){
		t.find('.user-bio-container').style.display = 'none';
		t.find('.user-bio-edition').style.display = 'block';
		t.find('#input-user-bio').focus();
	},
	'click #cancel-bio-edit' : function(e, t){
		e.preventDefault();
		t.find('.user-bio-container').style.display = 'block';
		t.find('.user-bio-edition').style.display = 'none';
	},
	'submit #form-user-bio': function(e, t){
		e.preventDefault();
		var user = {
			bio: t.find('#input-user-bio').value
		};

		Meteor.call('userUpdateBio', user, function(error, result) {
			// display the error to the user and abort
			if (error) {
				console.log(error);
				return alert(error.reason);
			}
			console.log("User bio successufully updated");
			
			// Close the edition
			t.find('.user-bio-container').style.display = 'block';
			t.find('.user-bio-edition').style.display = 'none';
	    });
	}
});