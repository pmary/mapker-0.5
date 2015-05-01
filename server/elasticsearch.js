/**
 * @namespace ElasticSearch
 * @summury Indexes set up and helpers
 * @see http://blog.qbox.io/quick-and-dirty-autocomplete-with-elasticsearch-completion-suggest for autocomplete exemple
 */

// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
Meteor.ES = new Elasticsearch.Client({
	host: 'https://site:3c871d7e986c01316ae4277ba6b588c5@fili-us-east-1.searchly.com',
	sniffOnStart: true,
	sniffInterval: 60000,
});

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
/**
 * @summary Sync the MongoDB data with easysearch
 */
var elasticsearchSync = function() {
	// Get all the users
	var users = Meteor.users.find().fetch();
	// Create the user documents
	for (var i = 0; i < users.length; i++) {
		Meteor.ES.methods.updateUserDocument(users[i]._id);
	};
}

/**
 * @summary Delete all the indices
 */
var deleteAllIndices = function() {
	Meteor.ES.indices.delete({index: '_all'}, function (error, response) {});
}

/**
 * @summary Setup the 'resources' indice and map the user and place types
 */
var setupIndicesAndMapping = function() {
	/**
	 * @summary Create the elasticsearch 'resources' incice
	 * and setup the completion suggester on the field we need to
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-completion.html
	 */
	Meteor.ES.indices.create({ index: "resources" }, function() {
		// Register specific mapping definition for places and user resources
		// See http://www.elastic.co/guide/en/elasticsearch/guide/master/complex-core-fields.html
		var placesBody = {
			// The resource object can be a place, a user or whatever
			place:{
				properties:{
					id: {"type" : "string"},			// The MongoDB id
					name: {"type" : "string"},
					cover: {
						"type": "object",
						"properties": {
							url: {"type" : "string", "index" : "no"},
							focusX: {"type" : "integer", "index" : "no"},
							focusY: {"type" : "integer", "index" : "no"},
							w: {"type" : "integer", "index" : "no"},
							h: {"type" : "integer", "index" : "no"},
						}
					},
					avatar: {
						"type": "object",
						"properties": {
							url: {"type" : "string", "index" : "no"}
						}
					},
					activities: {"type" : "string"},
					activities_suggest: {
						"type": "completion",
						"index_analyzer": "simple",
						"search_analyzer": "simple",
						"payloads": false
					}
				}
			}
		};
		Meteor.ES.indices.putMapping({index:"resources", type:"place", body:placesBody});

		var usersBody = {
			user: {
				properties:{
					id: {"type" : "string"},			// The MongoDB id
					loc: {"type" : "geo_point", "index" : "no"}, // profile.address.loc field
					name: {"type" : "string"},			// profile.fullname field
					cover: {
						"type": "object",
						"properties": {
							url: {"type" : "string", "index" : "no"},
							focusX: {"type" : "integer", "index" : "no"},
							focusY: {"type" : "integer", "index" : "no"},
							w: {"type" : "integer", "index" : "no"},
							h: {"type" : "integer", "index" : "no"},
						}
					},
					avatar: {
						"type": "object",
						"properties": {
							url: {"type" : "string", "index" : "no"}
						}
					},
					skills: {"type" : "string"}, // Flatenize the skills as an array rather than an object
					skills_suggest: {
						"type": "completion",
						"index_analyzer": "simple",
						"search_analyzer": "simple",
						"payloads": false
					}
				}
			}
		};
		Meteor.ES.indices.putMapping({index:"resources", type:"user", body:usersBody});
	});
};

/*****************************************************************************/
/* Methods */
/*****************************************************************************/
Meteor.ES.methods = {
	/**
	 * @summary Create a new user document in the 'resource' ES index
	 * @param {string} id The document id from MongoDB
	 */
	createUserDocument: function(id) {
		check(id, String);

		// Get the user data
		var user = Meteor.users.findOne({ "_id": id });
		if (!user) return;

		Meteor.ES.create({
			index: 'resources',
			type: 'user',
			id: id,
			body: {
		    	name: user.profile.fullname,
		    	cover: {},
		    	avatar: {},
		    	skills: {}
			}
		}, function (error, response) {
			if (error) return error;
			console.log(response);
			return response;
		});
	},
	/**
	 * @summary Update a user document from the 'resource' ES index
	 * @param {string} id The document id from MongoDB
	 */
	updateUserDocument: function(id) {
		check(id, String);

		// Get the user data
		var user = Meteor.users.findOne({ "_id": id });
		if (!user) return;

		// Flatenize the skills as an array rather than an object
		if (user.profile.skills) {
			var skills = [];
			for (var i = 0; i < user.profile.skills.length; i++) {
				skills.push(user.profile.skills[i].title);
			};
		};

		Meteor.ES.index({
			index: 'resources',
			type: 'user',
			id: id, // User id
			body: {
				loc: (user.profile.address ? user.profile.address.loc : undefined),
				name: user.profile.fullname,
				cover: {
					url: (user.cover ? user.cover.url : undefined),
					focusX: (user.cover ? user.cover.focusX : undefined),
					focusY: (user.cover ? user.cover.focusY : undefined),
					w: (user.cover ? user.cover.w : undefined),
					h: (user.cover ? user.cover.h : undefined)
				},
				avatar: { url: (user.avatar ? user.avatar.url : undefined) },
				skills: (skills ? skills : undefined),
				skills_suggest: {
					input: (skills ? skills : undefined)
				}
			}
		}, function (error, response) {
			Meteor.ES.get({
			  index: 'resources',
			  type: 'user',
			  id: id
			}, function (error, response) {
			  console.log(error);
			  console.log(response);
			});
		});
	},
	/**
	 * @summary Delete a user document from the 'resource' ES index
	 * @param {string} id The document id from MongoDB
	 */
	deletUserDocument: function(id) {
		check(id, String);
	},
	getSkillsSuggestions: function(queryString, callback) {
		// Get suggestions
		Meteor.ES.suggest({
			index: 'resources',
			body: {
				skills_suggester: {
					text: queryString,
					completion: {
						field: 'skills_suggest'
					}
				}
			}
		}, function (error, response) {
			callback( null, response.skills_suggester[0].options );
		});
	},
	getActivitiesSuggestions: function(queryString, callback) {
		// Get suggestions
		Meteor.ES.suggest({

		}, function (error, response) {

		});
	}
};

Meteor.methods({
	/**
	 * @summary Get skills suggested by query string for autocompletion purpose
	 * @see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams For an indeep suggest exemple
	 */
	getSkillsSuggestions: function(queryString) {
		check(queryString, String);

		var getSkillsSuggestionsAsync = Meteor.wrapAsync(Meteor.ES.methods.getSkillsSuggestions); // @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var results = getSkillsSuggestionsAsync(queryString);
		return results;
	}
});

/** Test procedure **/
// Create a user document
//Meteor.ES.methods.createUserDocument('i4FxWHYGyQr3LyN4x');

// Index user skills
//Meteor.ES.methods.updateUserSkills('i4FxWHYGyQr3LyN4x');

// Query against the skills_suggest indexe
// For an indeep suggest exemple see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams
/*Meteor.ES.suggest({
	index: 'resources',
	body: {
		skills_suggester: {
			text: 'Dé',
			completion: {
				field: 'skills_suggest'
			}
		}
	}
}, function (error, response) {
	console.log(error);
	console.log(response.skills_suggester[0].options);
});*/