Template.primaryNavbar.helpers({
});

Template.primaryNavbar.rendered = function() {
	// initialize all tooltips
	$('#primary-navbar [data-toggle="tooltip"]').tooltip();

	$search = $('#navbar-input-search').selectize({
		valueField: 'concate',
		labelField: 'name',
		searchField: 'name',
		sortField: 'name',
		persist: true,
		maxItems: 1,
		create: false,
		highlight: false,
		addPrecedence: false,
		loadingClass: 'selectize-load',
		render: {
			option: function(item, escape) {
				var result = '<div>' + 
					'<span class="logo-container">';
					if (item.avatar) {
						result += '<span class="logo" style="background-image: url(' + item.avatar.url + '?' + Date.now() + ')"></span>';
					};
					result += '</span>' + 
					'<span class="infos">' +
						'<span class="title">' +
							'<span class="name">' + escape(item.name) + '</span>';
							if (item.type == "place") {
								result += '<span class="type">Place</span>';
							}
							else if (item.type == "user") {
								result += '<span class="type">Maker</span>';
							}
						result += '</span>' +
					'</span>' +
				'</div>';

				return result;
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			
			Meteor.call('resourcesAutocomplete', query, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);
				
				for (var i = 0; i < result.length; i++) {
					result[i].concate = JSON.stringify(result[i]);
				};
				callback(result);
			});
		},
		onItemAdd: function(value, $item) {
			if (event && event.keyCode == 13) {
				event.stopPropagation();
				search.clear();
				search.blur();
				//$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
				Router.go('searchPlaces');
			} else {
				value = JSON.parse(value);
				// console.log( value );
				search.clear();
				search.blur();
				
				if (value.type == "user") {
					Router.go('userProfileBio', {_id: value._id});

				}
				else if (value.type == "place") {
					Router.go('placeProfileAbout', {_id: value._id});
				};
			}
		},
		onType: function(str) {
			Session.set('searchTerms', str);
		},
		onFocus: function() {
		},
		onBlur: function(){
			//$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
		}
	});

	$("#navbar-search .selectize-input input").keyup(function(e) {
		if (e && e.keyCode == 13) {
			e.stopPropagation();
			search.clear();
			search.blur();
			//$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
			Router.go('searchPlaces');
		}
	});

	search = $search[0].selectize;
}

Template.primaryNavbar.events({
	'click #modal-add-place' : function(e, t){
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalAddPlaceErrors', {});
		
		//console.log("Open modal " + t.$(event.target).data('modal-template'));
		// Open the add place modal
		var name = t.$(event.target).data('modal-template');
		Session.set('activeModal', name);
	},
	'submit #navbar-search': function(e, t) {
		e.preventDefault();
		Session.set('searchTerms', t.find('#navbar-input-search').value);
		t.find('#navbar-input-search').value = "";
		Router.go('searchPlaces');
	}
});