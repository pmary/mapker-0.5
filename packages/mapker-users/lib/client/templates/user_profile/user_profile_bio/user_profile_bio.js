Template.UserProfileBio.events({
	'click #update-user-bio' : function(e, t){
		var bioContainer = t.find('.user-bio-container'),
		bioEdition = t.find('.user-bio-edition'),
		bioInput = t.find('#input-user-bio');

		bioInput.style.height = bioContainer.clientHeight + 'px';
		bioContainer.style.display = 'none';
		bioEdition.style.display = 'block';
		bioInput.focus();
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

		Meteor.call('mapker:users/bioUpdate', user, function(error, result) {
			// display the error to the user and abort
			if (error) {
				console.log(error);
				return alert(error.reason);
			}

			// Close the edition
			t.find('.user-bio-container').style.display = 'block';
			t.find('.user-bio-edition').style.display = 'none';
	    });
	}
});
