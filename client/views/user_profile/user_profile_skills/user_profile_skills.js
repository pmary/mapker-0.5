Template.UserProfileSkills.events({
	'submit #add-skill-form' : function(e, t) {
		e.preventDefault();
		var skill = t.find('#input-skill').value;
		Meteor.call('userAddSkill', skill, function(error, result) {
			if (error)
				return console.log(error);

			console.log("User skill successufully added");
	    });
	}
});