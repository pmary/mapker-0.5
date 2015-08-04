Template.userProfileSkills.helpers({
	errorMessage: function(field) {
		if (Session.get('userProfileSkillsErrors'))
			return Session.get('userProfileSkillsErrors')[field];
	},
	errorClass: function (field) {
		if (Session.get('userProfileSkillsErrors'))
			return !!Session.get('userProfileSkillsErrors')[field] ? 'has-error' : '';
	},
	userOriginalSkills: function (field) {
		return Session.get('userOriginalSkills');
	},
	userEditedSkills: function (field) {
		return Session.get('userEditedSkills');
	}
});

Template.userProfileSkills.rendered = function() {
};


var userEditedSkills, userOriginalSkills;

Template.userProfileSkills.events({
	/**
	 * @summary When the user have no skill and click on the message, it hide the
	 * message and display the add skill form
	 */
	'click .user-add-bio-message': function (e, t) {
		$('.user-profile-bio .user-add-bio-message').css('display', 'none');
		$('.user-profile-bio .user-add-bio-form').css('display', 'block');
	},
	/**
	 * @summary Add a skill
	 */
	'submit #add-skill-form': function(e, t) {
		e.preventDefault();
		var skill = t.find('#input-skill').value;
		var skills = t.data.user.profile.skills;

		var errors = Users.validateUserAddSkill(skill, skills);
		Session.set('userProfileSkillsErrors', errors);
		if (Object.keys(errors).length) {
			setTimeout(function () {
				//Session.set('userProfileSkillsErrors', {});
			}, 2500);
			return; // Abort the account creation due to errors
		}

		Meteor.call('userAddSkill', skill, function(error, result) {
			if (error)
				return console.log(error);
			t.find('#input-skill').value = "";
	    });
	},
	/**
	 * @summary Display the skill edition UI and set the helpers
	 */
	'click .skill-edit' : function(e,t) {
		// Init the sessions variables with the original skills
		Session.set('userOriginalSkills', t.data.user.profile.skills);
		Session.set('userEditedSkills', t.data.user.profile.skills);

		// Display the edition zone
		t.find('.user-skills').style.display = 'none';
		t.find('.edit-user-skills').style.display = 'block';
	},
	'click .skill-remove' : function(e,t) {
		// Remove the selected skill from the 'userEditedSkills' session var
		var sessionSkills = Session.get('userEditedSkills');
		var newUserEditedSkills = sessionSkills.filter(function (el) {
			return el.title !== e.currentTarget.dataset.skillTitle;
		})
		Session.set('userEditedSkills', newUserEditedSkills);

		// Remove the item node from the dom
		//$(e.currentTarget.parentNode).remove();
	},
	'click #cancel-edit-user-skills' : function(e,t) {
		t.find('.user-skills').style.display = 'block';
		t.find('.edit-user-skills').style.display = 'none';
	},
	/**
	 * @summary Save the skills modifications
	 */
	'submit #edit-user-skills-form' : function(e,t) {
		e.preventDefault();
		Meteor.call('userUpdateSkills', Session.get('userEditedSkills'), function(error, result) {
			if (error)
				console.log(error);

			t.find('.user-skills').style.display = 'block';
			t.find('.edit-user-skills').style.display = 'none';
		});
	}
});
