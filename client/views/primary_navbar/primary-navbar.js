Template.primaryNavbar.helpers({
	// Check if we are on the search page and if yes, hide the navbar search form
	hideSearch: function() {
		if (Router.current() && Router.current().route._path == '/search')
			return true
		else
			return false
	}
});

Template.primaryNavbar.rendered = function() {
	$search = $('#navbar-input-search').selectize({
		valueField: 'concate',
		labelField: 'name',
		searchField: 'concate',
		sortField: 'name',
		persist: true,
		maxItems: 1,
		create: false,
		highlight: false,
		addPrecedence: false,
		render: {
			option: function(item, escape) {
				return '<a href="/places' + item._id + '/about">' +
					'<span class="logo-container">' +
						'<span class="logo" style="background-image: url(' + item.avatar.url + ')"></span>' +
					'</span>' +
					'<span class="infos">' +
						'<span class="title">' +
							'<span class="name">' + escape(item.name) + '</span>' +
							'<span class="type">Place - ' + escape(item.activities.join(', ')) + '</span>' +
						'</span>' +
					'<span>' +
				'</a>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			
			Meteor.call('resourcesAutocomplete', query, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);
				console.log(result);
				
				for (var i = 0; i < result.length; i++) {
					result[i].concate = JSON.stringify(result[i]);
				};
				callback(result);
			});
		},
		onItemAdd: function(value, $item) {
			value = JSON.parse(value);
			if (event && event.keyCode == 13) {
				event.stopPropagation();
				search.clear();
				search.blur();
				$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
				Router.go('search');
			} else {
				Router.go('placeProfileAbout', {_id: value._id});
			}
		},
		onType: function(str) {
			console.log('type');
			Session.set('searchTerms', str);
		},
		onFocus: function() {
		},
		onBlur: function(){
			$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
		}
	});

	$("#navbar-search .selectize-input input").keyup(function(e) {
		if (e && e.keyCode == 13) {
			e.stopPropagation();
			search.clear();
			search.blur();
			$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
			Router.go('search');
		}
	})

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
	'submit #navbar-search': function(e,t) {
		e.preventDefault();
		Session.set('searchTerms', t.find('#navbar-input-search').value);
		t.find('#navbar-input-search').value = "";
		Router.go('search');
	}
});