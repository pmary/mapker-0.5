/**
 * @summary Upload an image to a S3 bucket
 * @param {Object} [imgAttributes] The image attributes
 * @return {String} The uploaded file url
 */
Meteor.methods({
	/**
	 * @summary Upload an avatar or a cover image to S3 and update the related
	 * document with the image url
	 */
	uploadToS3: function(imgAttributes) {
    //console.log('In uploadToS3');

		var userId = this.userId;
		check(imgAttributes, {
			data: String,			// Encoded image data in data URI scheme (RFC 2397)
			resource: Object,	// Resource document required data (like the id)
			type: String,			// The file type. Ex.: "image/jpeg"
			role: String			// Avatar or cover
		});
		var img = _.extend(imgAttributes);

		// Check if the user have sufficient rights to update the resource
		if(!Core.isUserResourceAdmin(img.resource, this.userId)) {
			throw new Meteor.Error(401, "Bad credentials", "You are not authorized to update this resource");
		}

		var data = img.data.replace(/^data:image\/\w+;base64,/, ""); // Set the image data in base64
		var buf = new Buffer(data, 'base64'); // @doc https://nodejs.org/api/buffer.html
		var key = img.resource.id + '/' + img.role + '-' + Date.now(); // The S3 object key

		// Upload to S3 and get back the uploaded file url asyncronously
		var params = {Key: key, Body: buf, ContentType: img.type, ACL: 'public-read'};
		var s3UploadAsync = Meteor.wrapAsync(Core.s3Upload); // @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var url = s3UploadAsync(params);

		// Remove the old file if there is one
		if (img.resource[img.role]) {
			var deletionParams = {Key: img.resource[img.role].name};
			s3.deleteObject(deletionParams, function(err, data) {
				if (err) {
          console.log(err, err.stack);
        }
				else {
          console.log(data);
        }
			});
		}

		//console.log(url);

		// Create the image object to insert in the resource document
		var image = {
			url: url,
			name: key
		};

		// Update the resource
		if (img.resource.type === "user") {
			if (img.role === "avatar") {
				Meteor.users.update({_id: img.resource.id}, { $set: {'profile.avatar': image} });
			}
			else if (img.role === "cover") {
				Meteor.users.update({_id: img.resource.id}, { $set: {'profile.cover': image} });
			}
		}
		else if (img.resource.type === "place") {
			if (img.role === "avatar") {
				Places.update({_id: img.resource.id}, { $set: {'avatar': image} });
			}
			else if (img.role === "cover") {
				Places.update({_id: img.resource.id}, { $set: {'cover': image} });
			}
		}
		else if (img.resource.type === "community") {
			if (img.role === "avatar") {
				Communities.update({_id: img.resource.id}, { $set: {'avatar': image} });
			}
			else if (img.role === "cover") {
				Communities.update({_id: img.resource.id}, { $set: {'cover': image} });
			}
		}

		return url;
	}
});
