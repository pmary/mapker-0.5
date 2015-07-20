/**
 * @namespace ElasticSearch
 * @summury Indexes set up and helpers
 * @see http://blog.qbox.io/quick-and-dirty-autocomplete-with-elasticsearch-completion-suggest for autocomplete exemple
 */

// Check if we are in production or development environement
if (process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
	// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
	Meteor.ES = new Elasticsearch.Client({
		host: 'https://site:94bef02eac187cc0bf8ee704318f1144@kili-eu-west-1.searchly.com',
		sniffOnStart: true,
		sniffInterval: 60000,
	});
}
else {
	// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
	Meteor.ES = new Elasticsearch.Client({
		host: 'https://site:3c871d7e986c01316ae4277ba6b588c5@fili-us-east-1.searchly.com',
		sniffOnStart: true,
		sniffInterval: 60000,
		apiVersion: '1.5',
		log: [
			{
	    	type: 'file',
	    	level: 'trace',
	    	path: '../../../log/elasticsearch.log'
	  	}
		]
	});
}


/*****************************************************************************/
/* Methods */
/*****************************************************************************/
Meteor.ES.methods = {
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
						field: 'skills_suggest',
						fuzzy : {
							fuzziness : 2
						}
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
						field: 'activities_suggest',
						fuzzy : {
							fuzziness : 2
						}
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
			//console.log('Query the activities and the location');
			// Query the activities and the location
			Meteor.ES.search({
				index: 'resources',
				type: 'place',
				body: {
					query: {
						filtered: {
							query: {
								multi_match: {
									fields: ['activities_suggest', 'name'],
									query: queryObject.queryString,
									fuzziness: 2
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
			//console.log('Query on the activities only');
			// Query on the activities only
			Meteor.ES.search({
				index: 'resources',
				type: 'place',
				body: {
					query: {
						/*bool: {
							should: [
								{ match: { activities: queryObject.queryString } },
								{ match: { name: queryObject.queryString } }
							]
						}*/
						multi_match: {
							fields: ['activities_suggest', 'name'],
							query: queryObject.queryString,
							fuzziness: 2
						}
					}
				}
			}, function(error, response) {
				if (response && response.hits)
					callback( null, response.hits.hits );
			});
		} else if(!queryObject.queryString && queryObject.bbox) {
			//console.log('Query the location only');
			// Query the location only
			Meteor.ES.search({
				index: 'resources',
				type: 'place',
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
				type: 'user',
				body: {
					query: {
						filtered: {
							query: {
								bool: {
									should: [
										{ match: { skills: queryObject.queryString } },
										{ match: { name: queryObject.queryString } }
									]
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
				type: 'user',
				body: {
					query: {
						bool: {
							should: [
								{ match: { skills: queryObject.queryString } },
								{ match: { name: queryObject.queryString } }
							]
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
				type: 'user',
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
				if (error) console.log(error);
				console.log(queryObject.bbox);
				if (response && response.hits)
					callback( null, response.hits.hits );
			});
		} else {
			callback( null, [] );
		}
	},
	/**
	 * @summary Query the resources index users type to get the users
	 * whose fullname match with the given string
	 * @paramas {String} queryString
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getUsersByFullname: function(queryObject, callback) {
		if (! queryObject.exculdedIds) {
			queryObject.exculdedIds = [];
		}

		Meteor.ES.search({
			index: 'resources',
			type: 'user',
			body: {
				"query" : {
					"bool": {
						"must": [{
							"match_phrase_prefix": {
								"name": {
									"query": queryObject.string,
									"max_expansions": 50
								}
							}
						}],
						"must_not": {
							"terms": {
								"_id": queryObject.exculdedIds,
								"minimum_should_match": 1
							}
						}
					}
				},
				/*"facets": {
					"_id": {
						"terms": {
							"field": "_id",
							"exclude": queryObject.exculdedIds
						}
					}
				},*/
				"filter": {
					"query": {
						"ids":{
							"values": queryObject.network
						}
					}
				}
			}
		}, function(error, response) {
			if (error) console.log(error);

			if (response && response.hits)
				callback( null, response.hits.hits );
			else
				callback(null, null);
		});
	}
};

Meteor.methods({
	/**
	 * @summary Get skills suggested by query string for autocompletion purpose
	 * @see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams For an indeep suggest exemple
	 */
	getSkillsSuggestions: function (queryString) {
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
	getActivitiesSuggestions: function (queryString) {
		//console.log(queryString);
		check(queryString, String);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getActivitiesSuggestionsAsync = Meteor.wrapAsync(Meteor.ES.methods.getActivitiesSuggestions);
		var results = getActivitiesSuggestionsAsync(queryString);
		return results;
	},
	/**
	 * @summary Restore the elasticsearch index
	 */
	resetElasticSearch: function () {
		// Check if the user is loged in
		check(Meteor.userId(), String);
		// Check if the user is an admin
		if (Meteor.userId() != "i4FxWHYGyQr3LyN4x")
			return;

		// Rebuild the indexes
		wrappedRestoreIndex('', function(error, result) {
			// Restore the users documents
			wrappedRestoreDocuments('', function(error, result){
				console.log(error);
			});
		});
		// Restore the users documents
		//wrappedRestoreDocuments('');
	},
	getPlaces: function (queryObject) {
		check(queryObject, Object);

		var wrappedGetPlaces = Meteor.wrapAsync(Meteor.ES.methods.getPlaces);
		var results = wrappedGetPlaces(queryObject);
		// console.log(results);
		return results;
	},
	getUsers: function (queryObject) {
		check(queryObject, Object);

		var wrappedGetUsers = Meteor.wrapAsync(Meteor.ES.methods.getUsers);
		var results = wrappedGetUsers(queryObject);
		return results;
	},
	getUsersByFullname: function (queryObject) {
		check(queryObject, {
			string: String,
			network: Array,
			exculdedIds: Match.Optional(Array)
		});

		var wrappedGetUsersByFullname = Meteor.wrapAsync(Meteor.ES.methods.getUsersByFullname);
		var results = wrappedGetUsersByFullname(queryObject);
		return results;
	},
	/**
	 * @summary Update a user document in the ES 'resources' index
	 */
	updateUserESDocument: function (userId) {
		check(userId, String);

		// Get the user data
		var user = Meteor.users.findOne({_id: userId});

		// Create the user documents
		var id = user._id;

		// Init the body object
		var body = {};

		// Flatenize the skills as an array rather than an object
		body.skills_suggest = { input: [] };
		if (user.profile.skills) {
			body.skills = [];
			for (var y = 0; y < user.profile.skills.length; y++) {
				body.skills.push(user.profile.skills[y].title);
			};
			body.skills_suggest.input = body.skills;
		};

		if (user.profile.fullname) {
			body.name = user.profile.fullname;
			body.skills_suggest.input.push(user.profile.fullname);
			body.fullname_suggest = { input: [user.profile.fullname] };
		}

		if (user.profile.activity) {
			body.skills_suggest.input.push(user.profile.activity);
			body.activity = user.profile.activity;
		}

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

		Meteor.ES.index({
			index: 'resources',
			type: 'user',
			id: id, // User id
			body: body
		}, function (error, response) {
			//console.log(response);
			console.log(error);
			/*Meteor.ES.get({
			  index: 'resources',
			  type: 'user',
			  id: id
			}, function (error, response) {
				console.log(id);
				console.log(error);
			});*/
		});
	},
	/**
	 * @summary Update a user document in the ES 'resources' index
	 */
	updatePlaceESDocument: function (placeId) {
		check(placeId, String);

		// Get the place data
		var place = Places.findOne({_id: placeId});

		if (! place) {
			console.warn('No place find');
			return false;
		}

		// Create the place documents
		var id = place._id;

		// Init the body object
		var body = {}

		var autocompleteFields = [];
		if (place.name) {
			body.name = place.name;
			autocompleteFields.push(place.name);
		}
		if (place.types) {
			body.types = place.types;
			autocompleteFields = autocompleteFields.concat(place.types);
		}
		if (place.specialities) {
			body.specialities = place.specialities;
			autocompleteFields = autocompleteFields.concat(place.specialities);
		}
		body.activities_suggest = {input: autocompleteFields};

		if (place.formattedAddress)
			body.formattedAddress = place.formattedAddress;

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
			/*console.log(response);
			console.log(error);*/
			/*Meteor.ES.get({
			  index: 'resources',
			  type: 'place',
			  id: id
			}, function (error, response) {
				console.log(id);
				console.log(error);
			});*/
		});
	},
	/**
	 * @summary Get all the documents from the users collection
	 * and insert them in the elasticsearch index
	 */
	restoreUsersDocuments: function () {
		// Get all the users
		var users = Meteor.users.find().fetch();

		// Create the user documents
		for (var i = 0; i < users.length; i++) {
			var id = users[i]._id;
			// Get the user data
			var user = users[i];

			// Init the body object
			var body = {};

			// Flatenize the skills as an array rather than an object
			body.skills_suggest = { input: [] };
			if (user.profile.skills) {
				body.skills = [];
				for (var y = 0; y < user.profile.skills.length; y++) {
					body.skills.push(user.profile.skills[y].title);
				};
				body.skills_suggest.input = body.skills;
			};

			if (user.profile.fullname) {
				body.name = user.profile.fullname;
				body.skills_suggest.input.push(user.profile.fullname);
				body.fullname_suggest = { input: [user.profile.fullname] };
			}

			if (user.profile.activity) {
				body.skills_suggest.input.push(user.profile.activity);
				body.activity = user.profile.activity;
			}

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

			Meteor.ES.index({
				index: 'resources',
				type: 'user',
				id: id, // User id
				body: body
			}, function (error, response) {
				//console.log(response);
				console.log(error);
				/*Meteor.ES.get({
				  index: 'resources',
				  type: 'user',
				  id: id
				}, function (error, response) {
					console.log(id);
					console.log(error);
				});*/
			});
		};
		console.log( users.length + " users indexed!" );
	},
	/**
	 * @summary Get all the documents from the users collection
	 * and insert them in the elasticsearch index
	 */
	restorePlacesDocuments: function () {
		// Get all the places
		var places = Places.find().fetch();
		// Create the place documents
		for (var i = 0; i < places.length; i++) {
			var id = places[i]._id;
			// Get the place data
			var place = places[i];

			// Init the body object
			var body = {}

			var autocompleteFields = [];
			if (place.name) {
				body.name = place.name;
				autocompleteFields.push(place.name);
			}
			if (place.types) {
				body.types = place.types;
				autocompleteFields = autocompleteFields.concat(place.types);
			}
			if (place.specialities) {
				body.specialities = place.specialities;
				autocompleteFields = autocompleteFields.concat(place.specialities);
			}
			body.activities_suggest = {input: autocompleteFields};

			if (place.formattedAddress)
				body.formattedAddress = place.formattedAddress;

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
				/*console.log(response);
				console.log(error);*/
				/*Meteor.ES.get({
				  index: 'resources',
				  type: 'place',
				  id: id
				}, function (error, response) {
					console.log(id);
					console.log(error);
				});*/
			});
		};
		console.log( places.length + " places indexed!" );
	},
	/**
	 * @summary Delete all the indexes, rebuild them and set their mapping
	 */
	restoreIndex: function () {
		// Delete all the indices
		Meteor.ES.indices.delete({index: '_all'}, function (error, response) {
			if (error) return console.log(error);
			console.log('Delete indices:' + response.acknowledged);
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
									"tokenizer" : "standard",
									"filter" : ["lowercase", "substring", "token_limit"]
								},

								"autocomplete": {
									type: "custom",
									tokenizer: "keyword",
									filter: ["lowercase", "substring"]
								}
							},

							"filter" : {
								"substring" : {
									"type" : "nGram",
									"min_gram" : 1,
									"max_gram"  : 10
									//max_token_count : 250
								},
								"autocomplete_filter": {
									type: "edge_ngram",
									min_gram: 1,
									max_gram: 20
								},
								"token_limit": {
									type: "limit",
									max_token_count : 250
								}
							}
						}
					}
				}
			}, function(error, response) {
				if (error) return console.log(error);
				console.log('Create resources indice:' + response.acknowledged);
				// Register specific mapping definition for places and user resources
				// See http://www.elastic.co/guide/en/elasticsearch/guide/master/complex-core-fields.html
				var placesBody = {
					// The resource object can be a place, a user or whatever
					place:{
						properties:{
							id: {"type" : "string"},			// The MongoDB id
							loc: {"type" : "geo_point"}, 		// loc field
							name: {
								"type" : "string",
								/*"search_analyzer" : "str_search_analyzer",
								"index_analyzer" : "str_index_analyzer"*/
							},
							formattedAddress: { "type" : "string", "index" : "no" },
							cover: {
								"type": "object",
								"properties": {
									url: {"type" : "string", "index" : "no"}
								}
							},
							avatar: {
								"type": "object",
								"properties": {
									url: {"type" : "string", "index" : "no"}
								}
							},
							types: {
								"type" : "string",
								/*"search_analyzer" : "str_search_analyzer",
								"index_analyzer" : "str_index_analyzer"*/
							},
							specialities: {
								"type" : "string"
							},
							activities_suggest: {
								"type": "completion",
								"search_analyzer": "str_search_analyzer",
								"index_analyzer": "autocomplete",
								"payloads": false
							}
						}
					}
				};
				Meteor.ES.indices.putMapping({index:"resources", type:"place", body:placesBody}, function(error, response) {
					if (error) return console.log(error);
					console.log('Put place mapping:' + response.acknowledged);
					var usersBody = {
						user: {
							properties:{
								id: {"type" : "string"},			// The MongoDB id
								loc: {"type" : "geo_point"}, 		// profile.address.loc field
								name: {
									"type" : "string",				// profile.fullname field
									/*"search_analyzer" : "str_search_analyzer",
									"index_analyzer" : "str_index_analyzer"*/
								},
								activity: {
									"type": "string",
									"index" : "no"
								},
								cover: {
									"type": "object",
									"properties": {
										url: {"type" : "string", "index" : "no"}
									}
								},
								avatar: {
									"type": "object",
									"properties": {
										url: {"type" : "string"}
									}
								},
								skills: {
									"type" : "string", // Flatenize the skills as an array rather than an object
									/*"search_analyzer" : "str_search_analyzer",
									"index_analyzer" : "str_index_analyzer"*/
								},
								fullname_suggest: {
									"type": "completion",
									"search_analyzer": "str_search_analyzer",
									"index_analyzer": "autocomplete",
									"payloads": false
								},
								skills_suggest: {
									"type": "completion",
									"search_analyzer": "str_search_analyzer",
									"index_analyzer": "autocomplete",
									"payloads": false
								}
							}
						}
					};
					Meteor.ES.indices.putMapping({index:"resources", type:"user", body:usersBody}, function(error, response) {
						if (error) return console.log(error);
						console.log('Put user mapping:' + response.acknowledged);

						console.log("Mapping done !");
					});
				});
			});
		});
	}
});
