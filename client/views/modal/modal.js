Template.modal.helpers({  
	activeModal: function() {
		return Session.get('activeModal');
	}
});

Template.modalAddPlace.events({
	'click #submit-place' : function(e, t){
		var name = t.find('#input-name'),
		themes = $('#input-themes').tagsinput('items'),
		activities = $('#input-activities').tagsinput('items'),
		role = t.find('#input-role'),
		streetNumber = t.find('#input-street-number'),
		streetName = t.find('#input-street-name'),
		city = t.find('#input-city');

		var validate = fieldsValidation([
			{
				node: name, 
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: themes, 
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: activities, 
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: role, 
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: streetNumber, 
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: streetName, 
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: city, 
				type: "text",
				required: true,
				message: "Required Field"
			}
		]);

		// If the form is valide
		if (validate) {
			// Geocoding. See : http://open.mapquestapi.com/geocoding
			url = "http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluur2508n0%2C7x%3Do5-9w2ngu&outFormat=json&inFormat=json&json={location:{street:%27"+streetNumber+" "+streetName+"%27,city:%27"+city+"%27,state:%27"+country+"%27},options:{thumbMaps:false,maxResults:1}}";
		}
	}
});