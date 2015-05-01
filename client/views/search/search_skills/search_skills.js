Template.searchSkills.helpers({
	/*searchTerms: function () {
		return Session.get('searchTerms');
	},
	locationsResults: function () {
		return Session.get("locationsResults");
	},*/
	users: function () {
		return Session.get("searchUsersResults");
	}
});

Template.searchSkills.rendered = function() {
	$searchSkills = $('.search-skills #input-skills').selectize({
		valueField: 'text',
		labelField: 'text',
		searchField: 'text',
		sortField: 'score',
		persist: true,
		maxItems: 1,
		create: false,
		highlight: false,
		addPrecedence: false,
		loadingClass: 'selectize-load',
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<span class="title">' +
						'<span class="name">' + escape(item.text) + '</span>' +
					'</span>' +
				'</div>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			
			Meteor.call('getSkillsSuggestions', query, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);
				console.log(result)
				
				/*var myResult = [];
				for (var i = 0; i < result.length; i++) {
					myResult.push({activity: result[i].activities[0]});
				};*/
				callback(result);
			});
		},
		onItemAdd: function(value, $item) {},
		onItemRemove: function(value, $item) {},
		onType: function(str) {},
		onFocus: function() {},
		onBlur: function(){}
	});

	// Selectize init. for the where input field
	$('.search-skills #input-where').selectize({
		valueField: 'place_name',
		labelField: 'place_name',
		searchField: 'place_name',
		maxItems: 1,
		create: false,
		loadingClass: 'selectize-load',
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<span class="title">' +
						'<span class="name">' + escape(item.place_name) + '</span>' +
					'</span>' +
				'</div>';
			}
		},
		load: function(query, callback) {
			console.log('load');
			if (!query.length) return callback();
			query = encodeURIComponent(query.replace(/ /g, "+"));
			var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

			// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
			Meteor.http.get(queryUrl, function (error, result) {
				if (!error) {
					var content = JSON.parse(result.content);
					console.log(content);
					if (content.features && content.features.length) {
						callback(content.features.slice(0, 10));
					};
				}
			});
		},
		onType: function(str) {
			console.log('type');
		}
	});
}

Template.searchSkills.events({
	// Search nav
	'click #input-radio-place': function() {
		Router.go('searchPlaces');
	},
	'click #input-radio-skills': function() {
		Router.go('searchSkills');
	}
});