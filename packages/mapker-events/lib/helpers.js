Events.validateEventCreate = function (community) {
  /*{
    city: "Paris"
    contributors: Array[1]
    countryCode: "fr"
    description: "<div><b>Lorem</b></div><div><br></div><div>Ipsum dolor sit amet</div>"
    endDate: "2015-12-11T11:00:00.000Z"
    name: "Kick-off"
    reservation: "http://hello.com"
    startDate: "2015-11-11T11:00:00.000Z"
    streetName: "rue saint denis"
    streetNumber: "226"
    zipcode: "75002"
  }*/
  var errors = {};

	var nameError = Core.eventNameValidation(event.name);
	if (nameError) { errors.name = nameError; }



  // If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
  }

	return errors;
};
