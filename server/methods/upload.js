/**
 * @summary Perform a file upload to the default S3 bucket via the peerlibrary:aws-sdk package api
 * @param {Object} [resource] The resource document
 * @param {function} [callback] Meteor.wrapAsync callback function that return the uploaded file url
 */
s3Upload = function(params, callback) {
	s3.upload(params, function(err, data) {
		if (err) console.warn("Error uploading data: ", err);
		else callback && callback( null, data.Location );
	});
}

/**
 * @summary Check if the user has sufficient rights over the resource to perform the requested action
 * @param {Object} [resource] The resource document
 * @param {String} [userId] The current user id
 * @return {Boolean}
 */
isUserResourceAdmin = function(resource, userId) {
	// False by default
	var result = false;
	switch(resource.type) {
		case 'user':
			// If the user try to edit his own profile, let him go
			result = true;
			break;

		case 'place':
			// Check if the user id is in the 'administrators' resource array
			var correspondingPlace = Places.findOne({ $and: [ {administrators: userId}, {_id: resource.id} ] });
			if (correspondingPlace) result = true;
			break;
	}
	return result;
}

/**
 * @summary Upload an image to a S3 bucket
 * @param {Object} [imgAttributes] The image attributes
 * @return {String} The uploaded file url
 */
Meteor.methods({
	uploadToS3: function(imgAttributes) {
		var userId = this.userId;
		check(imgAttributes, {
			data: String,		// Encoded image data in data URI scheme (RFC 2397)
			resource: Object,	// Resource document required data (like the id)
			type: String,		// The file type. Ex.: "image/jpeg"
			role: String,		// Avatar or cover
			focusX: Match.Optional(Number),		// The rest of the attributes are for the focuspoint plugin
			focusY: Match.Optional(Number),
			w: Match.Optional(Number),
			h: Match.Optional(Number)
		});
		var img = _.extend(imgAttributes);

		// Check if the user have sufficient rights to update the resource
		if(!isUserResourceAdmin(img.resource, this.userId))
			throw new Meteor.Error(401, "Bad credentials", "You are not authorized to update this resource");

		var data = img.data.replace(/^data:image\/\w+;base64,/, ""); // Set the image data in base64
		var buf = new Buffer(data, 'base64'); // @doc https://nodejs.org/api/buffer.html
		var key = img.resource.id + '/' + img.role; // The S3 object key

		// Upload to S3 and get back the uploaded file url asyncronously
		var params = {Key: key, Body: buf, ContentType: img.type, ACL: 'public-read'};
		var s3UploadAsync = Meteor.wrapAsync(s3Upload); // @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var url = s3UploadAsync(params);
		//console.log(url);

		// Create the image object to insert in the resource document
		var image;
		if (img.role == "avatar") {
			image = {
				url: url,
				name: key
			};
		}
		else if (img.role == "cover") {
			image = {
				url: url,
				name: key,
				focusX: img.focusX,
				focusY: img.focusY,
				w: img.w,
				h: img.h
			};
		}

		// Update the resource
		if (img.resource.type == "user") {
			if (img.role == "avatar")
				Meteor.users.update({_id: img.resource.id}, { $set: {'profile.avatar': image} });
			else if (img.role == "cover")
				Meteor.users.update({_id: img.resource.id}, { $set: {'profile.cover': image} });
		}
		else if (img.resource.type == "place") {
			if (img.role == "avatar")
				Places.update({_id: img.resource.id}, { $set: {'avatar': image} });
			else if (img.role == "cover")
				Places.update({_id: img.resource.id}, { $set: {'cover': image} });
		};

		return url;
	}
});