Template.UserProfileSkills.helpers({
	errorMessage: function(field) {
		return Session.get('UserProfileSkillsErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('UserProfileSkillsErrors')[field] ? 'has-error' : '';
	},
	userOriginalSkills: function (field) {
		return Session.get('userOriginalSkills');
	}
});

Template.UserProfileSkills.rendered = function() {
	//Session.set('UserProfileSkillsErrors', {}); // Prevent undefined session warning
}


var userEditedSkills, userOriginalSkills;

Template.UserProfileSkills.events({
	'submit #add-skill-form' : function(e, t) {
		e.preventDefault();
		var skill = t.find('#input-skill').value;
		var skills = t.data.user.profile.skills;

		var errors = validateUserAddSkill(skill, skills);
		Session.set('UserProfileSkillsErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		Meteor.call('userAddSkill', skill, function(error, result) {
			if (error)
				return console.log(error);
			t.find('#input-skill').value = "";
	    });
	},
	'click .skill-edit' : function(e,t) {
		if (userOriginalSkills) {
			Session.set('userOriginalSkills', userOriginalSkills);	
		}
		else {
			Session.set('userOriginalSkills', t.data.user.profile.skills);
			userOriginalSkills = Session.get('userOriginalSkills');
		};
		userEditedSkills = Session.get('userOriginalSkills');
		// Display the edition zone
		t.find('.user-skills').style.display = 'none';
		t.find('.edit-user-skills').style.display = 'block';
	},
	'click .skill-remove' : function(e,t) {
		userEditedSkills.splice(userEditedSkills.indexOf(e.currentTarget.dataset.skillTitle), 1)
		Session.set('userOriginalSkills', userEditedSkills);
		$(e.currentTarget.parentNode).remove();
	},
	'click #cancel-edit-user-skills' : function(e,t) {
		t.find('.user-skills').style.display = 'block';
		t.find('.edit-user-skills').style.display = 'none';
	},
	'submit #edit-user-skills-form' : function(e,t) {
		e.preventDefault();
		Meteor.call('userUpdateSkills', userEditedSkills, function(error, result) {
			if (error)
				console.log(error);
			
			userOriginalSkills = userEditedSkills;
			t.find('.user-skills').style.display = 'block';
			t.find('.edit-user-skills').style.display = 'none';
		});
	}
});