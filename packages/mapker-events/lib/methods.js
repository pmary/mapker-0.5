Meteor.methods({
	/**
	 * @memberof Events
	 * @description
	 * Valid and insert a new event
	 */
	'mapker:events/insert': function (data) {
    check(Meteor.userId(), String); // Check if the user is loged in
		check(data, {
      organizer: {
				id							: String,
				type 						: String,
			},
			city              : String,
			contributors      : Array,
      countryCode       : String,
      about     			  : String,
      endDate           : String,
      formattedAddress  : String,
      loc: {
				lat							: Number,
				lon							: Number
			},
      name              : String,
      reservation       : String,
      startDate         : String,
      streetName        : String,
      streetNumber      : String,
      topic             : String,
      type              : String,
      zipcode           : String
		});

		// Format the data to match the collection schema
		var event = {
			about: data.about,
			address: {
		    city: data.city,
		    countryCode: data.countryCode,
		    formattedAddress: data.formattedAddress,
		    zipcode: data.zipcode,
		    loc: {
		      lat: data.loc.lat,
		      lon: data.loc.lon
		    }
		  },
		  createdBy: Meteor.userId(),
		  end: data.endDate,
		  link: data.reservation,
		  members: [
		    {
		      id: data.organizer.id,
		      type: data.organizer.type,
		      admin: true,
		      organizer: true
		    }
		  ],
		  name: data.name,
			start: data.endDate,
			topic: data.topic,
			type: data.type
		};
		// Add the collaborators
		for (var i = 0; i < data.contributors.length; i++) {
			event.members.push( {
				id: data.contributors[i].id,
				type: data.contributors[i].type,
				contributor: true
			});
		}

    var eventId = Events.insert( event );

		return eventId;
  }
});
