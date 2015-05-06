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
	 * @summary Create or update a place document from the 'resource' ES index
	 */
	updatePlaceDocument: function(id) {
		check(id, String);

		// Get the place data
		var place = Places.findOne({"_id": id});
		if (!place) return;

		// Init the body object
		var body = {}

		if (place.name) body.name = place.name;

		if (place.activities) {
			body.activities = place.activities;
			body.activities_suggest = {input: place.activities};
		}

		if (place.loc)
			body.loc = {lat: place.loc.lat, lon: place.loc.lon};

		if (place.avatar && place.avatar.url)
			body.avatar = {url: place.avatar.url};

		if (place.cover) {
			body.cover = {
				url: (place.cover.url ? place.cover.url : undefined),
				focusX: (place.cover.focusX ? place.cover.focusX : undefined),
				focusY: (place.cover.focusY ? place.cover.focusY : undefined),
				w: (place.cover.w ? place.cover.w : undefined),
				h: (place.cover.h ? place.cover.h : undefined)
			};
		};

		Meteor.ES.index({
			index: 'resources',
			type: 'place',
			id: id, // User id
			body: body
		}, function (error, response) {
			Meteor.ES.get({
			  index: 'resources',
			  type: 'place',
			  id: id
			}, function (error, response) {
				//console.log(response);
			});
		});
	},
	/**
	 * @summary Create or update a user document from the 'resource' ES index
	 * @param {string} id The document id from MongoDB
	 */
	updateUserDocument: function(id) {
		check(id, String);

		// Get the user data
		var user = Meteor.users.findOne({ "_id": id });
		if (!user) return;

		// Init the body object
		var body = {};

		// Flatenize the skills as an array rather than an object
		if (user.profile.skills) {
			body.skills = [];
			for (var i = 0; i < user.profile.skills.length; i++) {
				body.skills.push(user.profile.skills[i].title);
			};
			body.skills_suggest = { input: body.skills };
		};

		if (user.profile.fullname)
			body.name = user.profile.fullname;

		if (user.profile.address.loc && user.profile.address.loc.lat && user.profile.address.loc.lon)
			body.loc = {lat: user.profile.address.loc.lat, lon: user.profile.address.loc.lon};

		if (user.profile.avatar && user.profile.avatar.url)
			body.avatar = {url: user.profile.avatar.url};

		if (user.profile.cover) {
			body.cover = {
				url: (user.profile.cover.url ? user.profile.cover.url : undefined),
				focusX: (user.profile.cover.focusX ? user.profile.cover.focusX : undefined),
				focusY: (user.profile.cover.focusY ? user.profile.cover.focusY : undefined),
				w: (user.profile.cover.w ? user.profile.cover.w : undefined),
				h: (user.profile.cover.h ? user.profile.cover.h : undefined)
			};
		};

		// Exemple: 
		/*loc: {
			lat: user.profile.address.loc.lat,
			lon: user.profile.address.loc.lon
		},
		name: user.profile.fullname,
		cover: {
			url: user.profile.cover.url,
			focusX: user.profile.cover.focusX,
			focusY: user.profile.cover.focusY,
			w: user.profile.cover.w,
			h: user.profile.cover.h
		},
		avatar: { 
			url: user.profile.avatar.url
		},
		skills: skills,
		skills_suggest: {
			input: skills
		}*/

		

		Meteor.ES.index({
			index: 'resources',
			type: 'user',
			id: id, // User id
			body: body
		}, function (error, response) {
			Meteor.ES.get({
			  index: 'resources',
			  type: 'user',
			  id: id
			}, function (error, response) {
				//console.log(response);
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
	/**
	 * @summary Get the matching user skills name suggestions
	 * @params {String} queryString
	 */
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
	 * @summary Get the matching palce activities name suggestions
	 * @params {String} queryString
	 */
	getActivitiesSuggestions: function(queryString, callback) {
		// Get suggestions
		Meteor.ES.suggest({
			index: 'resources',
			body: {
				activities_suggester: {
					text: queryString,
					completion: {
						field: 'activities_suggest'
					}
				}
			}
		}, function (error, response) {
			if (response && response.activities_suggester && response.activities_suggester[0])
				callback( null, response.activities_suggester[0].options );
		});
	},
	/**
	 * @summary Query the resources index places type to get the places 
	 * with a particular activity and/or within the given location
	 * @paramas {Object} queryObject
	 * @params {String} queryString
	 * @params {Array} [bbox]
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getPlaces: function(queryObject, callback) {
		check(queryObject, Object);

		if (queryObject.queryString && queryObject.bbox) {
			console.log('Query the activities and the location');
			// Query the activities and the location
			Meteor.ES.search({
				index: 'resources',
				body: {
					query: {
						filtered: {
							query: {
								match: {
									activities: queryObject.queryString
								}
							},
							filter: {
								geo_bounding_box: {
									"place.loc" :{
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
			console.log('Query on the activities only');
			// Query on the activities only
			Meteor.ES.search({
				index: 'resources',
				body: {
					query: {
						match: {
							activities: queryObject.queryString
						}
					},
					
				}
			}, function(error, response) {
				if (response && response.hits)
					callback( null, response.hits.hits );
			});
		} else if(!queryObject.queryString && queryObject.bbox) {
			console.log('Query the location only');
			// Query the location only
			Meteor.ES.search({
				index: 'resources',
				body: {
					"query" : {
						"match_all" : {}
					},
					"filter" : {
						"geo_bounding_box" : {
							"place.loc" : {
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
	},
	/**
	 * @summary Query the resources index users type to get the users 
	 * with a particular skills and/or within the given location
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
				console.log(error);
				console.log(queryObject.bbox);
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
	 * @summary Get activities suggested by query string for autocompletion purpose
	 * @see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams For an indeep suggest exemple
	 */
	getActivitiesSuggestions: function(queryString) {
		console.log(queryString);
		check(queryString, String);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getActivitiesSuggestionsAsync = Meteor.wrapAsync(Meteor.ES.methods.getActivitiesSuggestions); 
		var results = getActivitiesSuggestionsAsync(queryString);
		return results;
	},
	/**
	 * @summary Restore the elasticsearch index
	 */
	resetElasticSearch: function() {
		// Check if the user is loged in
		check(Meteor.userId(), String);
		// Check if the user is an admin
		if (Meteor.userId() != "i4FxWHYGyQr3LyN4x")
			return;

		// Rebuild the indexes
		wrappedRestoreIndex('', function(error, result) {
			// Restore the users documents
			wrappedRestoreDocuments('', function(error, result){
				//console.log(error);
			});
		});
		// Restore the users documents
		//wrappedRestoreDocuments('');
	},
	getPlaces: function(queryObject) {
		check(queryObject, Object);

		var wrappedGetPlaces = Meteor.wrapAsync(Meteor.ES.methods.getPlaces); 
		var results = wrappedGetPlaces(queryObject);
		console.log(results);
		return results;
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
var restoreDocuments = function(req, callback) {
	// Get all the users
	var users = Meteor.users.find().fetch();
	// Create the user documents
	for (var i = 0; i < users.length; i++) {
		Meteor.ES.methods.updateUserDocument(users[i]._id);
	};
	console.log( users.length + " users indexed!" );

	// Get all the places
	var places = Places.find().fetch();
	// Create the place documents
	for (var i = 0; i < places.length; i++) {
		Meteor.ES.methods.updatePlaceDocument(places[i]._id);
	};
	console.log( places.length + " places indexed!" );

	callback(null, true);
};
var wrappedRestoreDocuments = Meteor.wrapAsync(restoreDocuments);

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
		Meteor.ES.indices.create({ 
			index: "resources", 
			body: {
				settings: {
					"analysis" : {
						"analyzer" : {
							"str_search_analyzer" : {
								"tokenizer" : "keyword",
								"filter" : ["lowercase"]
							},

							"str_index_analyzer" : {
								"tokenizer" : "keyword",
								"filter" : ["lowercase", "substring"]
							}
						},

						"filter" : {
							"substring" : {
								"type" : "nGram",
								"min_gram" : 1,
								"max_gram"  : 20
							}
						}
					}
				}
			}
		}, function() {
			// Register specific mapping definition for places and user resources
			// See http://www.elastic.co/guide/en/elasticsearch/guide/master/complex-core-fields.html
			var placesBody = {
				// The resource object can be a place, a user or whatever
				place:{
					properties:{
						id: {"type" : "string"},			// The MongoDB id
						loc: {"type" : "geo_point"}, 		// loc field
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
						activities: {
							"type" : "string",
							"search_analyzer" : "str_search_analyzer",
							"index_analyzer" : "str_index_analyzer"
						},
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
						loc: {"type" : "geo_point"}, 		// profile.address.loc field
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

			/*Meteor.ES.indices.putSettings({ 
				index: "resources",
				body: {
					
				}
			});*/

			console.log("Mapping done !");
			callback(null, true);
		});
	});
};
var wrappedRestoreIndex = Meteor.wrapAsync(restoreIndex);