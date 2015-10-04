Template.communityProfileAbout.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function () {
		if (this.community && Meteor.user()) {
			var isAdmin = Communities.findOne({
				_id: this.community._id,
				members: { $elemMatch: { id: Meteor.user()._id, admin: true } }
			});
			if (isAdmin) {
				return true;
			}
			else {
				return false;
			}
		}
	}
});

Template.communityProfileAbout.events({
	'click #update-user-bio' : function(e, t){
		var bioContainer = t.find('.user-bio-container'),
		bioEdition = t.find('.user-bio-edition'),
		bioInput = t.find('#input-place-about');

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
		var community = {
			id: t.data.community._id,
			description: t.find('#input-place-about').value
		};

		Meteor.call('mapker:community/updateDescription', community, function(error) {
			if (error) {
				return console.log(error);
      }

			// Close the edition
			t.find('.user-bio-container').style.display = 'block';
			t.find('.user-bio-edition').style.display = 'none';
	    });
	}
});
