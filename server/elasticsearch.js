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
				loc: {
					lat: (user.profile.address ? user.profile.address.loc.lat : undefined),
					lon: (user.profile.address ? user.profile.address.loc.lon : undefined)
				},
				name: user.profile.fullname,
				cover: {
					url: (user.profile.cover ? user.profile.cover.url : undefined),
					focusX: (user.profile.cover ? user.profile.cover.focusX : undefined),
					focusY: (user.profile.cover ? user.profile.cover.focusY : undefined),
					w: (user.profile.cover ? user.profile.cover.w : undefined),
					h: (user.profile.cover ? user.profile.cover.h : undefined)
				},
				avatar: { 
					url: (user.profile.avatar ? user.profile.avatar.url : undefined) 
				},
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
			if (response && response.skills_suggester && response.skills_suggester[0])
				callback( null, response.skills_suggester[0].options );
		});
	},
	/**
	 * @todo Integrate the suggestion search for the place activities
	 */
	getActivitiesSuggestions: function(queryString, callback) {
		// Get suggestions
		Meteor.ES.suggest({

		}, function (error, response) {

		});
	},
	/**
	 * @summary Query the resources index users type to get the users 
	 * with a particular skills and within the given location
	 * @paramas {Object} queryObject
	 * @params {String} queryString
	 * @params {Array} [bbox]
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getUsers: function(queryObject, callback) {
		check(queryObject, Object);

		if (queryObject.queryString && queryObject.bbox) {
			// Query the skill and the location
			Meteor.ES.search({
				index: 'resources',
				body: {
					query: {
						filtered: {
							query: {
								match: {
									skills: queryObject.queryString
								}
							},
							filter: {
								geo_bounding_box: {
									"user.loc" :{
										"top" : queryObject.bbox[3],
										"left" : queryObject.bbox[0],
										"bottom" : queryObject.bbox[1],
										"right" : queryObject.bbox[2]
									}
								}
							}
						}
					},
					
				}
			}, function(error, response) {
				if (response && response.hits)
					callback( null, response.hits.hits );
			});
		} else if(queryObject.queryString && !queryObject.bbox) {
			// Query on the skill only
			Meteor.ES.search({
				index: 'resources',
				body: {
					query: {
						match: {
							skills: queryObject.queryString
						}
					},
					
				}
			}, function(error, response) {
				if (response && response.hits)
					callback( null, response.hits.hits );
			});
		} else if(!queryObject.queryString && queryObject.bbox) {
			// Query the location only
			Meteor.ES.search({
				index: 'resources',
				body: {
					"query" : {
						"match_all" : {}
					},
					"filter" : {
						"geo_bounding_box" : {
							"user.loc" : {
								"top" : queryObject.bbox[3],
								"left" : queryObject.bbox[0],
								"bottom" : queryObject.bbox[1],
								"right" : queryObject.bbox[2]
							}
						}
					}		
				}
			}, function(error, response) {
				if (response && response.hits)
					callback( null, response.hits.hits );
			});
		} else {
			callback( null, [] );
		}
	}
};

Meteor.methods({
	/**
	 * @summary Get skills suggested by query string for autocompletion purpose
	 * @see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams For an indeep suggest exemple
	 */
	getSkillsSuggestions: function(queryString) {
		check(queryString, String);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getSkillsSuggestionsAsync = Meteor.wrapAsync(Meteor.ES.methods.getSkillsSuggestions); 
		var results = getSkillsSuggestionsAsync(queryString);
		return results;
	},
	/**
	 * @summary Restore the elasticsearch index
	 */
	resetElasticSearch: function() {
		wrappedRestoreIndex('');
		wrappedRestoreUsersDocuments('');
	},
	getUsers: function(queryObject) {
		check(queryObject, Object);

		var wrappedGetUsers = Meteor.wrapAsync(Meteor.ES.methods.getUsers); 
		var results = wrappedGetUsers(queryObject);
		return results;
	}
});

/**
 * @summary Get all the documents from the users collection
 * and insert them in the elasticsearch index
 */
var restoreUsersDocuments = function(req, callback) {
	// Get all the users
	var users = Meteor.users.find().fetch();
	// Create the user documents
	for (var i = 0; i < users.length; i++) {
		Meteor.ES.methods.updateUserDocument(users[i]._id);
	};
	callback(null, true);
};
var wrappedRestoreUsersDocuments = Meteor.wrapAsync(restoreUsersDocuments);

/**
 * @summary Delete all the indexes, rebuild them and set their mapping
 */
var restoreIndex = function(req, callback) {
	// Delete all the indices
	Meteor.ES.indices.delete({index: '_all'}, function (error, response) {
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
						loc: {"type" : "geo_point"}, // profile.address.loc field
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
								url: {"type" : "string"}
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

			callback(null, true);
		});
	});
};
var wrappedRestoreIndex = Meteor.wrapAsync(restoreIndex);

Meteor.call('resetElasticSearch', function(){
	console.log('ok');
});