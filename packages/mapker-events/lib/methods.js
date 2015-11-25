Meteor.methods({
	'mapker:events/insert': function (event) {
    check(Meteor.userId(), String); // Check if the user is loged in
		check(event, {
      organizer         : Object,
			city              : String,
			contributors      : Array,
      countryCode       : String,
      description       : String,
      endDate           : String,
      formattedAddress  : String,
      loc               : {
				lat: Number,
				lon: Number
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

    var user = Meteor.user();

    var eventId = Events.insert( event );
  }
});
