function debounce (fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * @summary Retrieve all the identities of the user, it mean, its places,
 * communities and projects
 * @return {Array} identities
 * @return {Object} identities.
 *
 * Exemple of an identity object:
 * {
 *   avatar: 'https://www.john.com/avatar.png',
 *   current: true,
 *   id: 'i4FxWHYGyQr3LyN4x',
 *   name: 'John Doe',
 *   type: 'user'
 * }
 */
var getUserIdentities = function (t) {
  var user = Meteor.user(),
  fields = ['id', 'name', 'avatar'], // The fields in which we will process the search against the ES data
  ids = [],	// Will contain the identities id
  identities = []; // Will contains the identities details as objects

  if (user) {
		// First, push the user identity
		var userIdentity = {
			id: user._id,
			current: true,
			name: user.profile.fullname,
			type: 'user',
			avatar: user.profile.avatar ? user.profile.avatar.url : Core.getDefaultAvatar('user')
		};
		identities.push(userIdentity);

    // Check if the user has places
    if (
      user.profile &&
      user.profile.network &&
      user.profile.network.places &&
      user.profile.network.places.length
    ) {
      for (var i = 0; i < user.profile.network.places.length; i++) {
        if (user.profile.network.places[i].admin) {
          var id = user.profile.network.places[i].id;
					// Add the place id in the ids array
          ids.push(id);
        }
      }
    }

		// Check if user has projects
		/* @todo */

		// Check if user has communities
		if (
      user.profile &&
      user.profile.network &&
      user.profile.network.communities &&
      user.profile.network.communities.length
    ) {
      var communities = user.profile.network.communities;
      for (var y = 0; y < communities.length; y++) {
        if (communities[y].admin) {
          // Add the community id in the ids array
          ids.push(communities[y].id);
        }
      }
    }

    if (ids.length) {
      // Query the ES index to get the documents details
      Meteor.call('mapker:search/getDocumentById', ids, fields, function (err, res) {
        if (err) {
          console.log('getDocumentById err', err);
        }

				if (res.hits && res.hits.hits) {
					// Get the identities
					for (var i = 0; i < res.hits.hits.length; i++) {
						var identity = {
							id: res.hits.hits[i]._id,
							name: res.hits.hits[i]._source.name,
							type: res.hits.hits[i]._type,
							avatar: res.hits.hits[i]._source.avatar ? res.hits.hits[i]._source.avatar.url : Core.getDefaultAvatar(res.hits.hits[i]._type)
						};
						identities.push(identity);
					}
					console.log('identities: ', identities);

					// Update the session variable
          t.identities.set( identities );
					// Activa the tooltip 'Posting as ...'
					$('.modal-create-event .modal-header [data-toggle="tooltip"]').tooltip();
				}
      });
    }
  }
};

Template.modalCreateEvent.onCreated(function () {
  // Initialization
  var instance = this;
  instance.contributors       = new ReactiveVar( null );
  instance.staticMap          = new ReactiveVar( null );
  instance.eventContributors  = new ReactiveVar( [] );
  instance.focusedContributor = new ReactiveVar( -1 );
  instance.identities         = new ReactiveVar( [] );
  instance.countries          = new ReactiveVar( [] );
  instance.location           = new ReactiveVar();

  // Autorun
  instance.autorun(function () {
    // Taxons subscription
    var taxonsSubscription = instance.subscribe('eventsTaxons');

    // If the subscription is ready
    if (taxonsSubscription.ready()) {
      console.log('subscription ready');
    }
    else {
      console.log('subscription not ready');
    }

    // Get the cursor
    /*instance.taxons = function() {
      return Taxons.find({collection: 'events'});
    };*/
  });
});

Template.modalCreateEvent.helpers({
	errorMessage: function (field) {
		if (Session.get('modalCreateEventErrors')) {
			return Session.get('modalCreateEventErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('modalCreateEventErrors')) {
			return !!Session.get('modalCreateEventErrors')[field] ? 'has-error' : '';
		}
	},
  staticMap: function () {
    return Template.instance().staticMap.get();
  },
	countries: function () {
    return Template.instance().countries.get();
  },
	identities: function () {
    return Template.instance().identities.get();
	},
	contributors: function () {
    return Template.instance().contributors.get();
	},
  eventContributors: function () {
    return Template.instance().eventContributors.get();
  },
  taxons: function() {
    return Taxons.find({collection: 'events'});
  }
});

Template.modalCreateEvent.rendered = function () {
  // We need to retrieved all the identities of the user, it mean, its
  // places, communities and projects
  getUserIdentities(Template.instance());

	// Init the date range picker
	$('input[name="input-date"]').daterangepicker({
		parentEl: '.modal-create-event',
    timePicker: true,
    timePickerIncrement: 30,
		timePicker24Hour: true,
    locale: {
      format: 'MM/DD/YYYY h:mm'
    }
  });

	// Subscribe to the Countries
	Meteor.subscribe("countriesList");

	this.autorun(function (computation) {
		// If there is no selectize instance on the country select
		if (! selectizeCountry) {
			// Get the countries
			var countries = Countries.find().fetch();

			// If all the countries has been retrieved
			if (countries.length == 245) {
				// Stop the tracker
				computation.stop();

        Template.instance().countries.set( countries );

				setTimeout(function () {
					// Init a selectize instance on the country select
					var $selectContry = $('.modal-create-event select#select-country').selectize({
						maxItems: 1
					});

					selectizeCountry = $selectContry[0].selectize;
				}, 0);
			}
		}
	});

	// Init the Quill editor
	this.editor = new Quill('.modal-create-event #editor', {
		modules: {
			'toolbar': { container: '.modal-create-event #toolbar' },
			'link-tooltip': true
		},
  	theme: 'snow'
	});
};

Template.modalCreateEvent.events({
	/**
	 * @summary Change the current identity
	 */
	'click .change-identity': function (e, t) {
		// Get the user identities
		var identities = t.identities.get();

		//
		for (var y = 0; y < identities.length; y++) {
			identities[y].current = false;
		}

		// Set the selected one as the current identity
		for (var i = 0; i < identities.length; i++) {
			if (identities[i].id === this.id) {
				var tempIdentity = identities[i];
				tempIdentity.current = true;
				identities.splice(i, 1);
				identities.unshift(tempIdentity);
				break;
			}
		}

		// Update the identities session var
    t.identities.set( identities );

		// If this is the current identity, just return
		if (this.current) {
			return;
		}
	},
  'keydown #input-contributor': debounce(function (e, t) {
    var contributors = t.contributors.get();
    var focusedContributor = t.focusedContributor.get();

    // Check if the key is the up arrow
    if (e.keyCode === 38) {
      console.log('Up');
      // If there is no contributor focused in the list and there is a list
      if (focusedContributor && contributors && contributors[focusedContributor - 1]) {
        contributors[focusedContributor].focused = false;
        contributors[focusedContributor - 1].focused = true;

        focusedContributor--;

        t.contributors.set( contributors );
        t.focusedContributor.set( focusedContributor );
      }
      /*else {
        for (let i = 0; i < contributors.length; i++) {
          //contributors[i]
        }
      }*/
    }
    // Else if the key is the down arrow
    else if (e.keyCode === 40) {
      focusedContributor++;

      // If there is no contributor focused in the list and there is a list
      if (! focusedContributor && contributors && contributors[0]) {
        contributors[0].focused = true;
        t.focusedContributor.set( 0 );
      }
      else if (contributors && contributors[focusedContributor]) {
        contributors[focusedContributor - 1].focused = false;
        contributors[focusedContributor].focused = true;
        t.focusedContributor.set( focusedContributor );
      }
      t.contributors.set( contributors );
    }
    // Else if the key is Enter
    else if (e.keyCode === 13) {
      // If we have a contributor focused in the list and if he exist
      if (
        (focusedContributor || focusedContributor === 0) &&
        contributors &&
        contributors[focusedContributor]
      ) {
        // Add the focused contributor to the selected list
        var eventContributors = t.eventContributors.get();
        eventContributors.push(contributors[focusedContributor]);
        t.eventContributors.set( eventContributors );
        // Clear the contributor list and the input field
        t.contributors.set( [] );
        t.find('#input-contributor').value = '';
      }
      else {
        return;
      }
    }
    else {
      t.contributors.set( null );
    }
  }),
	'keyup #input-contributor': debounce(function (e, t) {
		var name = t.find('#input-contributor').value;

    if (
      name.length >= 2 &&
      e.keyCode !== 13 &&
      e.keyCode !== 38 &&
      e.keyCode !== 40
    ) {
			// Query the ES index to find any resource with this name/nick or a close one
			Meteor.call('mapker:search/getDocumentByName', name, function(err, res) {
				if (err) {
					//console.log('err', err);
          t.contributors.set( null );
				}
				else {
					// If there is result
					if (res.hits.total) {
						// Format the results
						var results = res.hits.hits;
						var contributors = [];

						for (var i = 0; i < results.length; i++) {
							var contributor = {
								id: results[i]._id,
                type: results[i]._type,
								name: results[i]._source.name,
								nicHandle: results[i]._source.nicHandle,
								avatar: results[i]._source.avatar ? results[i]._source.avatar.url : Core.getDefaultAvatar(results[i]._type)
							};
							contributors.push(contributor);
						}

						// Update the contributors list
            t.contributors.set( contributors );
            window.setTimeout(function() {
              $('.contributors-list').css('display', 'block');
            }, 200);
					}
          else {
            t.contributors.set( null );
          }
				}
			});
		}
	}, 250),
  'focusout #input-contributor': function () {
    window.setTimeout(function() {
      $('.modal-create-event .contributors-list').css('display', 'none');
    }, 300);
  },
  'click .contributors-list .contributor': function (e, t) {
    var newContributor = this;
    var eventContributors = t.eventContributors.get();

    // If there is already some contributors
    if (eventContributors && eventContributors.length) {
      // Check if the new one is not already in the list
      for (var i = 0; i < eventContributors.length; i++) {
        if (eventContributors[i].id === newContributor.id) {
          return false;
        }
      }
    }

    eventContributors.push(this);
    t.eventContributors.set(eventContributors);
  },
  /**
   * @description
   * Remove a contributor from the eventContributors list
   */
  'click .event-contributor-list .remove': function (e, t) {
    var contributor = this;
    var eventContributors = t.eventContributors.get();

    for (var i = 0; i < eventContributors.length; i++) {
      if (eventContributors[i].id === contributor.id) {
        eventContributors.splice(i, 1);
      }
    }

    t.eventContributors.set(eventContributors);
  },
  'click .user-action-create': function (e, t) {
    // Display the button loader state
		$('.user-action-create').addClass('btn-loader');

    var dates = $('input[name="input-date"]').data('daterangepicker');

    // Get the data
    var event = {
      name: t.find('#input-name').value,
      streetNumber: t.find('#input-street-number').value,
  		streetName: t.find('#input-street-name').value,
  		zipcode: t.find('#input-zipcode').value,
  		countryCode: t.find('#select-country').value,
  		city: t.find('#input-city').value,
      startDate: dates.startDate.toISOString(),
      endDate: dates.endDate.toISOString(),
      description: t.editor.getHTML(),
      contributors: t.eventContributors.get(),
      reservation: t.find('#input-reservation').value
    };

    console.log('event: ', event);

    // Form validation
    var errors = Events.validateEventCreate(event);
    Session.set('modalCreatePlaceErrors', errors);
    if (Object.keys(errors).length) {
      // Remove the button loader state
      $('.user-action-create').removeClass('btn-loader');
      return; // Abort the account creation due to errors
    }
  },
  /**
   * @description
   * Get the map following the given location and display it
   */
   'click .user-action-check-location': function (e, t) {
     console.log('will check the location');

     var location = {
       streetNumber: t.find('#input-street-number').value,
       streetName: t.find('#input-street-name').value,
       zipcode: t.find('#input-zipcode').value,
       countryCode: t.find('#select-country').value,
       city: t.find('#input-city').value,
     };

     var address = location.streetNumber+ "+" + location.streetName + "+" +location.city;
   	 address = address.replace(/ /g, '+');

     // Geocoding. See: https://developers.google.com/maps/documentation/geocoding/
   	 var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&components=country:" + location.countryCode;

     // Get geocode
     Meteor.http.get(url, function (error, result) {
       if (!error) {
         //console.log(result);
         var data = result.data;
         var width = $('.modal-create-event .map').width();

         if (data.status === "OK") {
           t.staticMap.set("<img class='static-map' alt='Location map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + address + "&zoom=13&size=314x207&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");

           location.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];
           location.formattedAddress = data.results[0].formatted_address;
           t.location.set( location );
         }
       }
     });

     //t.staticMap.set( '' );
   }
});
