/*****************************************************************************/
/* Methods */
/*****************************************************************************/
var SearchMethods = {
	/**
	 * @description
	 * Delete a user document from the 'resource' ES index
	 *
	 * @param {string} id The document id from MongoDB
	 */
	deletUserDocument: function (id) {
		check(id, String);
	},
	/**
	 * @description
	 * Get an indexed document by its id
	 *
	 * @param {Array} docIds - The ids of the documents to retrieved
	 * @param {Array} fields - The fields to retrieve
	 */
	getDocumentById: function (docIds, fields, callback) {
		// Create the query base structure
		var esQuery = {
			index: 'resources',
			//type: 'place',
			body: {
				query: {
					ids: {
						values: docIds
					}
				}
			}
		};

		if (fields) {
			esQuery.body._source = fields;
		}

		// Launch the search
		if (Meteor.isServer) {
			Search.search(esQuery, function (error, response) {
				if (error) {
					console.log('getDocumentById error: ', error);
					callback( null, [] );
				}

				if (response && response.hits) {
					callback( null, response);
				}
				else {
					callback( null, [] );
				}
			});
		}
	},
	/**
	 * @description
	 * Get the matching user skills name suggestions
	 *
	 * @param {String} queryString
	 */
	getSkillsSuggestions: function (queryString, callback) {
		// Get suggestions
		if (Meteor.isServer) {
			Search.suggest({
				index: 'resources',
				type: 'user',
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
		}
	},
	/**
	 * @description
	 * Get the matching palce activities name suggestions
	 *
	 * @param {String} queryString
	 */
	getActivitiesSuggestions: function (queryString, callback) {
		// Get suggestions
		if (Meteor.isServer) {
			Search.suggest({
				index: 'resources',
				type: 'place',
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
		}
	},
	/**
	 * @description
	 * Query the resources index 'community' type to get the communities
	 * with a particular name
	 *
	 * @param {Object} queryObject
	 * @param {String} queryObject.queryString
	 */
	getCommunitiesSuggestions: function (queryString, callback) {
		// Get suggestions
		if (Meteor.isServer) {
			Search.suggest({
				index: 'resources',
				type: 'community',
				body: {
					activities_suggester: {
						text: queryString,
						completion: {
							field: 'suggester',
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
		}
	},
	/**
	 * @description
	 * Query the resources index places type to get the places
	 * with a particular activity and/or within the given location
	 *
	 * @param {Object} queryObject
	 * @param {String} queryObject.queryString
	 * @param {Array} queryObject.bbox
	 * @param {Object} queryObject.filters
	 * @param {Array} queryObject.filters.types
	 * @param {Array} queryObject.filters.specializations
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getPlaces: function (queryObject, callback) {
		check(queryObject, Object);

		// If no size is given, set one by default
		if (!queryObject.size) {
			queryObject.size = 10;
		}

		// If no from is given, set 0 by default
		if (!queryObject.from) {
			queryObject.from = 0;
		}

		// Create the query base structure
		var esQuery = {
			index: 'resources',
			type: 'place',
			body: {
				from: queryObject.from,
				size: queryObject.size,
				query: {
					filtered: {
						query: {},
						filter: {
							bool: {
								must: [],
								should: [],
      					//"must_not" : []
							}
						}
					}
				}
			}
		};

		// Add the query
		if (queryObject.queryString) {
			// If there is a query string
			esQuery.body.query.filtered.query = {
				multi_match: {
					fields: ['activities_suggest', 'name'],
					query: queryObject.queryString,
					fuzziness: 2
				}
			};
		}
		else {
			// Else, match all
			esQuery.body.query.filtered.query = { match_all: {} };
			// And add a sort by name desc
			esQuery.body.sort = { 'name': { 'order': 'asc' } };
		}

		// If there is a bbox
		if (queryObject.bbox) {
			// Add it to the ES query filters
			esQuery.body.query.filtered.filter.bool.must.push({
				geo_bounding_box: {
					"place.loc":{
						top: queryObject.bbox[3],
						left: queryObject.bbox[0],
						bottom: queryObject.bbox[1],
						right: queryObject.bbox[2]
					}
				}
			});
		}

		// If there is a type filter
		if (queryObject.filters && queryObject.filters.types.length) {
			// Add it to the ES query filters
			esQuery.body.query.filtered.filter.bool.should.push({
				terms: {
					types: queryObject.filters.types
				}
			});
		}

		// If there is a specializations filter
		if (queryObject.filters && queryObject.filters.specializations.length) {
			// Add it to the ES query filters
			esQuery.body.query.filtered.filter.bool.should.push({
				terms: {
					specialities: queryObject.filters.specializations
				}
			});
		}

		// Launch the search
		if (Meteor.isServer) {
			Search.search(esQuery, function (error, response) {
				if (error) {
					console.log('getPlaces error: ', error);
					callback( null, [] );
				}

				if (response && response.hits) {
					callback( null, response);
				}
				else {
					callback( null, [] );
				}
			});
		}
	},
	/**
	 * @description
	 * Query the resources index users type to get the users
	 * with a particular skills and/or within the given location
	 *
	 * @param {Object} queryObject
	 * @param {String} queryString
	 * @param {Array} [bbox]
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getUsers: function (queryObject, callback) {
		check(queryObject, Object);

		// If no size is given, set one by default
		if (!queryObject.size) {
			queryObject.size = 10;
		}

		// If no from is given, set 0 by default
		if (!queryObject.from) {
			queryObject.from = 0;
		}

		// Create the query base structure
		var esQuery = {
			index: 'resources',
			type: 'user',
			body: {
				from: queryObject.from,
				size: queryObject.size,
				query: {
					filtered: {
						query: {},
						filter: {
							bool: {
								must: [],
								should: [],
      					//"must_not" : []
							}
						}
					}
				}
			}
		};

		// Add the query
		if (queryObject.queryString) {
			// If there is a query string
			esQuery.body.query.filtered.query = {
				multi_match: {
					fields: ['skills_suggest', 'name', 'activity'],
					query: queryObject.queryString,
					fuzziness: 2
				}
			};
		}
		else {
			// Else, match all
			esQuery.body.query.filtered.query = { match_all: {} };
			// And add a sort by name desc
			esQuery.body.sort = { 'name': { 'order': 'asc' } };
		}

		// If there is a bbox
		if (queryObject.bbox) {
			// Add it to the ES query filters
			esQuery.body.query.filtered.filter.bool.must.push({
				geo_bounding_box: {
					"user.loc":{
						top: queryObject.bbox[3],
						left: queryObject.bbox[0],
						bottom: queryObject.bbox[1],
						right: queryObject.bbox[2]
					}
				}
			});
		}

		// Launch the search
		if (Meteor.isServer) {
			Search.search(esQuery, function (error, response) {
				if (error) {
					console.log('getUsers error: ', error);
					callback( null, [] );
				}

				if (response && response.hits) {
					callback( null, response );
				}
				else {
					callback( null, [] );
				}
			});
		}
	},
	/**
	 * @description
	 * Query the resources index resources type to get the communities
	 * by name
	 *
	 * @param {Object} queryObject
	 * @param {String} queryString
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getCommunities: function (queryObject, callback) {
		check(queryObject, Object);

		// If no size is given, set one by default
		if (!queryObject.size) {
			queryObject.size = 10;
		}

		// If no from is given, set 0 by default
		if (!queryObject.from) {
			queryObject.from = 0;
		}

		// Create the query base structure
		var esQuery = {
			index: 'resources',
			type: 'community',
			body: {
				from: queryObject.from,
				size: queryObject.size,
				query: {
					filtered: {
						query: {},
						filter: {
							bool: {
								must: [],
								should: [],
      					//"must_not" : []
							}
						}
					}
				}
			}
		};

		// Add the query
		if (queryObject.queryString) {
			// If there is a query string
			esQuery.body.query.filtered.query = {
				multi_match: {
					fields: ['name', 'suggester'],
					query: queryObject.queryString,
					fuzziness: 2
				}
			};
		}
		else {
			// Else, match all
			esQuery.body.query.filtered.query = { match_all: {} };
			// And add a sort by name desc
			esQuery.body.sort = { 'name': { 'order': 'asc' } };
		}

		// Launch the search
		if (Meteor.isServer) {
			Search.search(esQuery, function (error, response) {
				if (error) {
					console.log('getCommunities error: ', error);
					callback( null, [] );
				}

				if (response && response.hits) {
					callback( null, response);
				}
				else {
					callback( null, [] );
				}
			});
		}
	},
	/**
	 * @description
	 * Query the resources index users type to get the users
	 * whose fullname match with the given string
	 *
	 * @param {String} queryString
	 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html for more about Geo Bounding Box Filter
	 */
	getUsersByFullname: function (queryObject, callback) {
		if (! queryObject.exculdedIds) {
			queryObject.exculdedIds = [];
		}

		if (Meteor.isServer) {
			Search.search({
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
					"filter": {
						"query": {
							"ids":{
								"values": queryObject.network
							}
						}
					}
				}
			}, function (error, response) {
				if (error) {
					console.log(error);
				}

				if (response && response.hits) {
					//console.log(response.hits);
					callback( null, response.hits.hits );
				}
				else {
					callback(null, null);
				}
			});
		}
	},
	 /**
 	 * @description
	 * Get an indexed document by its name
	 *"must_not": {
		 "terms": {
			 "_id": queryObject.exculdedIds,
			 "minimum_should_match": 1
		 }
	 }
 	 * @param {String} name - The name or partial name of the documents to retrieved
 	 * @param {Array} exculdedIds - The ids of the documents to exclude
 	 */
 	getDocumentByName: function (name, exculdedIds, callback) {
		var esQuery = {
			index: 'resources',
			body: {
				size: 6,
				query : {
					bool: {
						must: [{
							multi_match: {
								query: name,
								type: 'phrase_prefix',
								fields: ['name', 'nicHandle'],
								"max_expansions": 50
							}
						}],
						must_not: {
							terms: {
								_id: exculdedIds,
								"minimum_should_match": 1
							}
						}
					}
				},
				filter: {
					or: {
						filters: [
							{ type: { value: 'user' } },
							{ type: { value: 'place' } },
							{ type: { value: 'community' } },
						]
					}
				}
			}
		};

 		// Launch the search
		if (Meteor.isServer) {
	 		Search.search(esQuery, function (error, response) {
	 			if (error) {
	 				console.log('getDocumentById error: ', error);
	 				callback( null, [] );
	 			}
	 			else if (response && response.hits) {
	 				//console.log('response', JSON.stringify(response));
	 				callback( null, response);
	 			}
	 			else {
	 				callback( null, [] );
	 			}
	 		});
		}
 	}
};

Meteor.methods({
	/**
	 * @description
	 * Get an indexed document by its id
	 *
	 * @param {Array} docIds - The ids of the documents to retrieved
	 * @param {Array} fields - The fields to retrieve
	 */
	'mapker:search/getDocumentById': function (docIds, fields) {
		check(docIds, Array);
		check(fields, Match.Optional(Array));

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getDocumentByIdAsync = Meteor.wrapAsync(SearchMethods.getDocumentById);
		if (fields) {
			return getDocumentByIdAsync(docIds, fields);
		}
		else {
			return getDocumentByIdAsync(docIds);
		}
	},
	'mapker:search/getDocumentByName': function (name, exculdedIds) {
		check(name, String);
		check(exculdedIds, Array);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getDocumentByNameAsync = Meteor.wrapAsync(SearchMethods.getDocumentByName);
		return getDocumentByNameAsync(name, exculdedIds);
	},
	/**
	 * @description
	 * Get skills suggested by query string for autocompletion purpose
	 *
	 * @see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams For an indeep suggest exemple
	 */
	'mapker:search/getSkillsSuggestions': function (queryString) {
		check(queryString, String);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getSkillsSuggestionsAsync = Meteor.wrapAsync(SearchMethods.getSkillsSuggestions);
		var results = getSkillsSuggestionsAsync(queryString);
		return results;
	},
	/**
	 * @description
	 * Get activities suggested by query string for autocompletion purpose
	 *
	 * @see http://blog.qbox.io/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams For an indeep suggest exemple
	 */
	'mapker:search/getActivitiesSuggestions': function (queryString) {
		//console.log(queryString);
		check(queryString, String);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getActivitiesSuggestionsAsync = Meteor.wrapAsync(SearchMethods.getActivitiesSuggestions);
		var results = getActivitiesSuggestionsAsync(queryString);
		return results;
	},
	/**
	 * @description
	 * Get communities suggested by query string for autocompletion purpose
	 */
	'mapker:search/getCommunitiesSuggestions': function (queryString) {
		//console.log(queryString);
		check(queryString, String);

		// @doc http://docs.meteor.com/#/full/meteor_wrapasync
		var getCommunitiesSuggestionsAsync = Meteor.wrapAsync(SearchMethods.getCommunitiesSuggestions);
		var results = getCommunitiesSuggestionsAsync(queryString);
		return results;
	},
	'mapker:search/getPlaces': function (queryObject) {
		check(queryObject, Object);

		var wrappedGetPlaces = Meteor.wrapAsync(SearchMethods.getPlaces);
		var results = wrappedGetPlaces(queryObject);
		// console.log(results);
		return results;
	},
	'mapker:search/getUsers': function (queryObject) {
		check(queryObject, Object);

		var wrappedGetUsers = Meteor.wrapAsync(SearchMethods.getUsers);
		var results = wrappedGetUsers(queryObject);
		return results;
	},
	'mapker:search/getCommunities': function (queryObject) {
		check(queryObject, Object);

		var wrappedGetCommunities = Meteor.wrapAsync(SearchMethods.getCommunities);
		var results = wrappedGetCommunities(queryObject);
		return results;
	},
	'mapker:search/getUsersByFullname': function (queryObject) {
		check(queryObject, {
			string: String,
			network: Array,
			exculdedIds: Match.Optional(Array)
		});

		var wrappedGetUsersByFullname = Meteor.wrapAsync(SearchMethods.getUsersByFullname);
		var results = wrappedGetUsersByFullname(queryObject);
		return results;
	},
	/**
	 * @description
	 * Update a document in the ES index
	 *
	 * @param {String} docId - The MongoDB id of the document to update in the index
	 * @param {String} type - The type of the document to update
	 */
	'mapker:search/updateDocument': function (docId, type) {
		check(Meteor.userId(), String);
		check(docId, String);
		check(type, String);

		var doc;

		switch (type) {
			case 'user':
				doc = Meteor.users.findOne({_id: docId});
			break;

			case 'place':
				doc = Places.findOne({_id: docId});
			break;

			case 'community':
				doc = Communities.findOne({_id: docId});
			break;

			default:
				return;
		}
		// console.log('doc ', JSON.stringify(doc));

		// Format the body for the index query
		var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
		var body = getIndexBody(type, doc);

		// Update the documents
		if (Meteor.isServer) {
			Search.index({
				index: 'resources',
				type: type,
				id: docId, // Document id
				body: body
			}, function (error, response) {});
		}
	},
	/**
	 * @description
	 * Update a user document in the ES 'resources' index
	 */
	'mapker:search/updateUserESDocument': function (userId) {
		check(userId, String);

		// Get the user data
		var user = Meteor.users.findOne({_id: userId});

		// Create the user documents
		var id = user._id;

		// Format the body for the index query
		var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
		var body = getIndexBody('user', user);

		// Index the resource
		if (Meteor.isServer) {
			Search.index({
				index: 'resources',
				type: 'user',
				id: id, // User id
				body: body
			}, function (error, response) {});
		}
	},
	/**
	 * @description
	 * Update an event document in the ES 'resources' index
	 */
	'mapker:search/updateEventESDocument': function (eventId) {
		check(eventId, String);

		// Get the event data
		var event = Events.findOne({_id: eventId});

		if (! event) {
			console.warn('No event find');
			return false;
		}

		// Create the event document
		var id = event._id;

		// Format the body for the index query
		var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
		var body = getIndexBody('event', event);

		// Index the resource
		if (Meteor.isServer) {
			Search.index({
				index: 'resources',
				type: 'event',
				id: id, // Place id
				body: body
			}, function (error, response) {});
		}
	},
	/**
	 * @description
	 * Update a user document in the ES 'resources' index
	 */
	'mapker:search/updatePlaceESDocument': function (placeId) {
		check(placeId, String);

		// Get the place data
		var place = Places.findOne({_id: placeId});

		if (! place) {
			console.warn('No place find');
			return false;
		}

		// Create the place documents
		var id = place._id;

		// Format the body for the index query
		var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
		var body = getIndexBody('place', place);

		// Index the resource
		if (Meteor.isServer) {
			Search.index({
				index: 'resources',
				type: 'place',
				id: id, // Place id
				body: body
			}, function (error, response) {});
		}
	},
	/**
	 * @description
	 * Get all the documents from the users collection
	 * and insert them in the elasticsearch index
	 */
	'mapker:search/restoreUsersDocuments': function () {
		// Get all the users
		var users = Meteor.users.find().fetch();

		// Create the user documents
		for (var i = 0; i < users.length; i++) {
			var id = users[i]._id;
			// Get the user data
			var user = users[i];

			// Format the body for the index query
			var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
			var body = getIndexBody('user', user);

			// Index the resource
			if (Meteor.isServer) {
				Search.index({
					index: 'resources',
					type: 'user',
					id: id, // User id
					body: body
				});
			}
		}
		console.log( users.length + " users indexed!" );
	},
	/**
	 * @description
	 * Get all the documents from the place collection
	 * and insert them in the elasticsearch index
	 */
	'mapker:search/restorePlacesDocuments': function () {
		// Get all the places
		var places = Places.find().fetch();
		// Create the place documents
		for (var i = 0; i < places.length; i++) {
			var id = places[i]._id;
			// Get the place data
			var place = places[i];

			// Format the body for the index query
			var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
			var body = getIndexBody('place', place);

			// Index the resource
			if (Meteor.isServer) {
				Search.index({
					index: 'resources',
					type: 'place',
					id: id, // Place id
					body: body
				});
			}
		}
		console.log( places.length + " places indexed!" );
	},
	/**
	 * @description
	 * Get all the documents from the event collection
	 * and insert them in the elasticsearch index
	 */
	'mapker:search/restoreEventsDocuments': function () {
		// Get all the places
		var events = Events.find().fetch();
		// Create the place documents
		for (var i = 0; i < events.length; i++) {
			var id = events[i]._id;
			// Get the place data
			var event = events[i];

			// Format the body for the index query
			var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
			var body = getIndexBody('event', event);

			// Index the resource
			if (Meteor.isServer) {
				Search.index({
					index: 'resources',
					type: 'event',
					id: id, // Place id
					body: body
				});
			}
		}
		console.log( events.length + " events indexed!" );
	},
	/**
	 * @description
	 * Delete all the indexes, rebuild them and set their mapping
	 */
	'mapker:search/resetIndexAndMaping': function () {
		check(Meteor.userId(), String);

		// Check if the user is an admin
		if ( Roles.userIsInRole(Meteor.userId(), ['admin']) ) {
			if (Meteor.isServer) {
				SearchMethods.resetIndex().then(function (val) {
					// Now, register specific mapping definition for our specific types
					SearchMethods.putMapping('user')
					.then(SearchMethods.putMapping('place'))
					.then(SearchMethods.putMapping('community'))
					.then(SearchMethods.putMapping('event'))
					.then( function () {
						console.log('Index reset complete');
					});
				}).catch(function (err) {
					console.log('resetIndex err', err);
				});
			}
		}
	},
	/**
	 * @description
	 * Restore the documents of the 'resources' index from the database
	 */
	'mapker:search/restoreIndexDocuments': function () {
		check(Meteor.userId(), String);

		// Check if the user is an admin
		if ( Roles.userIsInRole(Meteor.userId(), ['admin']) ) {
			if (Meteor.isServer) {
				SearchMethods.restoreIndexDocuments( Places.find().fetch(), 'place' )
				.then( SearchMethods.restoreIndexDocuments( Meteor.users.find().fetch(), 'user' ) )
				.then( SearchMethods.restoreIndexDocuments( Communities.find().fetch(), 'community' ) )
				.then( SearchMethods.restoreIndexDocuments( Events.find().fetch(), 'event' ) )
				.then( function () {
					console.log('Documents restoration complete');
				});
			}
		}
	}
});

/**
 * @description
 * Build the body to insert into the index
 *
 * @param {String} type - The type of the body to build. Can be 'user',
 * 'place' or 'community'
 * @param {Object} source - The complete document from which create the body
 * @return {Object} body - The body to insert into the ES index
 */
SearchMethods.getIndexBody = function (type, source, callback) {
	// Init the body object
	var body = {};

	// Build a different body following the document type
	switch (type) {
		case 'user':
			// Flatenize the skills as an array rather than an object
			body.skills_suggest = { input: [] };
			if (source.profile.skills) {
				body.skills = [];
				for (var y = 0; y < source.profile.skills.length; y++) {
					body.skills.push(source.profile.skills[y].title);
				}
				body.skills_suggest.input = body.skills;
			}

			if (source.profile.fullname) {
				body.name = source.profile.fullname;
				body.skills_suggest.input.push(source.profile.fullname);
				body.fullname_suggest = { input: [source.profile.fullname] };
			}

			if (source.profile.nicHandle) {
				body.nicHandle = source.profile.nicHandle;
			}

			if (source.profile.activity) {
				body.skills_suggest.input.push(source.profile.activity);
				body.activity = source.profile.activity;
			}

			if (source.profile.address.loc && source.profile.address.loc.lat && source.profile.address.loc.lon) {
				body.loc = {lat: source.profile.address.loc.lat, lon: source.profile.address.loc.lon};
			}

			if (source.profile.address.countryCode) {
				body.countryCode = source.profile.address.countryCode;
			}

			if (source.profile.address.zipcode) {
				body.zipcode = source.profile.address.zipcode;
			}

			if (source.profile.address.city) {
				body.city = source.profile.address.city;
			}

			if (source.profile.avatar && source.profile.avatar.url) {
				body.avatar = {url: source.profile.avatar.url};
			}

			if (source.profile.cover) {
				body.cover = {
					url: (source.profile.cover.url ? source.profile.cover.url : undefined)
				};
			}
		break;

		case 'place':
			let autocompleteFields = [];
			if (source.name) {
				body.name = source.name;
				autocompleteFields.push(source.name);
			}

			if (source.nicHandle) {
				body.nicHandle = source.nicHandle;
			}

			if (source.types) {
				body.types = source.types;
				autocompleteFields = autocompleteFields.concat(source.types);
			}

			if (source.specialities) {
				body.specialities = source.specialities;
				autocompleteFields = autocompleteFields.concat(source.specialities);
			}
			body.activities_suggest = {input: autocompleteFields};

			if (source.formattedAddress) {
				body.formattedAddress = source.formattedAddress;
			}

			if (source.loc) {
				body.loc = {lat: source.loc.lat, lon: source.loc.lon};
			}

			if (source.avatar && source.avatar.url) {
				body.avatar = {url: source.avatar.url};
			}

			if (source.cover) {
				body.cover = {
					url: (source.cover.url ? source.cover.url : undefined)
				};
			}
		break;

		case 'community':
			//console.log('source', source);
			body.suggester = { input: [] };

			if (source.name) {
				body.suggester.input.push(source.name);
				body.name = source.name;
			}

			if (source.nicHandle) {
				body.suggester.input.push(source.nicHandle);
			}

			if (source.avatar && source.avatar.url) {
				body.avatar = { url: source.avatar.url };
			}

			if (source.cover) {
				body.cover = { url: source.cover.url };
			}
			//console.log('community body', body);
		break;

		case 'event':
			console.log('Event source: ', source);
			let suggesterFields = [];

			if (source.name) {
				body.name = source.name;
				suggesterFields.push(source.name);
			}

			if (source.organizer) {
				body.organizer = source.organizer;
			}

			if (source.loc) {
				body.loc = {lat: source.loc.lat, lon: source.loc.lon};
			}

			if (source.startDate) {
				body.startDate = source.startDate;
			}

			if (source.endDate) {
				body.endDate = source.endDate;
			}

			if (source.formattedAddress) {
				body.formattedAddress = source.formattedAddress;
			}

			if (source.type) {
				body.type = source.type;

				let eventType = Taxons.findOne({ _id: source.type }, { fields: { name: 1 } });
				if (eventType) { suggesterFields.push( eventType.name ); }
			}

			if (source.topic) {
				body.topic = source.topic;

				let eventTopic = Taxons.findOne({ _id: source.topic }, { fields: { name: 1 } });
				if (eventTopic) { suggesterFields.push( eventTopic.name ); }
			}

			if (source.avatar && source.avatar.url) {
				body.avatar = {url: source.avatar.url};
			}

			if (source.cover) {
				body.cover = {
					url: (source.cover.url ? source.cover.url : undefined)
				};
			}

			body.event_suggester = {input: suggesterFields};
		break;
	} // End of the switch on 'type'

	callback(null, body);
};

/**
 * @description
 * Delete the 'resources' ES index and recreate it
 *
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-delete-index.html
 * @see http://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-completion.html
 */
SearchMethods.resetIndex = function () {
	return new Promise(function (resolve, reject) {
		// Delete the index
		console.log('Will delete the resources index');
		if (Meteor.isServer) {
			Search.indices.delete({index: 'resources'}, function (error, response) {
				if (error) {
					console.log('Error during resources index deletion: ' + JSON.stringify(error));
					reject(error);
				}
				else {
					console.log('The resources index has been deleted');

					var resourcesIdxConfig = {
						index: "resources",
						body: {
							settings: {
								analysis: {
									analyzer: {
										str_search_analyzer: {
											tokenizer: "keyword",
											filter: ["lowercase"]
										},

										str_index_analyzer: {
											tokenizer: "standard",
											filter: ["lowercase", "substring", "token_limit"]
										},

										autocomplete: {
											type: "custom",
											tokenizer: "keyword",
											filter: ["lowercase", "substring"]
										}
									},

									filter: {
										substring: {
											type: "nGram",
											min_gram: 1,
											max_gram : 10
										},
										autocomplete_filter: {
											type: "edge_ngram",
											min_gram: 1,
											max_gram: 20
										},
										token_limit: {
											type: "limit",
											max_token_count : 250
										}
									}
								}
							}
						}
					};
					// Re-create the index
					Search.indices.create(resourcesIdxConfig, function (error, response) {
						if (error) {
							reject(error);
						}
						else {
							console.log('The resources index has been re-created');
							resolve(response);
						}
					});
				}
			});
		}
	});
};

/**
 * @description
 * Create an index
 *
 * @param {String} index - The name of the index to create. Can be 'user', 'place' or 'community'
 */
SearchMethods.putMapping = function (index) {
	var body;

	return new Promise(function (resolve, reject) {
		switch (index) {
			case 'user':
				body = {
					user: {
						properties: {
							id: { type: "string" },			// The MongoDB id
							loc: { type: "geo_point" }, 		// profile.address.loc field
							countryCode: { type: "string" },
							city: { type: "string" },
							zipcode: { type: "string" },
							name: { type: "string" }, // profile.fullname field
							nicHandle: { type: "string" },
							activity: {
								type: "string",
								index: "no"
							},
							cover: {
								type: "object",
								properties: {
									url: { type: "string", index: "no" }
								}
							},
							avatar: {
								type: "object",
								properties: {
									url: { type: "string" }
								}
							},
							skills: {
								type: "string", // Flatenize the skills as an array rather than an object
							},
							fullname_suggest: {
								type: "completion",
								search_analyzer: "str_search_analyzer",
								index_analyzer: "autocomplete",
								payloads: false
							},
							skills_suggest: {
								type: "completion",
								search_analyzer: "str_search_analyzer",
								index_analyzer: "autocomplete",
								payloads: false
							}
						}
					}
				};
			break;

			case 'place':
				body = {
					// The resource object can be a place, a user or whatever
					place:{
						properties: {
							id: { type: "string" },			// The MongoDB id
							loc: { type : "geo_point" }, 		// loc field
							name: { type: "string", },
							nicHandle: { type: "string" },
							formattedAddress: { type: "string", index: "no" },
							cover: {
								type: "object",
								properties: {
									url: { type: "string", index: "no" }
								}
							},
							avatar: {
								type: "object",
								properties: {
									url: { type: "string", index: "no" }
								}
							},
							types: {
								type: "string",
							},
							specialities: {
								type: "string"
							},
							activities_suggest: {
								type: "completion",
								search_analyzer: "str_search_analyzer",
								index_analyzer: "autocomplete",
								payloads: false
							}
						}
					}
				};
			break;

			case 'community':
				body = {
					community: {
						properties:{
							id: {"type" : "string"},			// The MongoDB id
							name: { type: "string" },
							nicHandle: { type: "string" },
							cover: {
								type: "object",
								properties: {
									url: {type: "string", "index" : "no"}
								}
							},
							avatar: {
								type: "object",
								properties: {
									url: {"type" : "string"}
								}
							},
							suggester: {
								type: "completion",
								search_analyzer: "str_search_analyzer",
								index_analyzer: "autocomplete",
								payloads: false
							}
						}
					}
				};
			break;

			case 'event':
			body = {
				// The resource object can be a place, a user or whatever
				place:{
					properties: {
						id: { type: "string" },			// The MongoDB id
						organizer: { id: "string", type: "String" },
						loc: { type : "geo_point" }, 		// loc field
						name: { type: "string", },
						startDate: { type: "date", format: "yyyy/MM/dd HH:mm:ss" },
						endDate: { type: "date", format: "yyyy/MM/dd HH:mm:ss" },
						formattedAddress: { type: "string", index: "no" },
						description: { type: "string" },
						reservation: { type: "string" },
						type: { type: "string" },
						topic: { type: "string" },
						cover: {
							type: "object",
							properties: {
								url: { type: "string", index: "no" }
							}
						},
						avatar: {
							type: "object",
							properties: {
								url: { type: "string", index: "no" }
							}
						},
						event_suggester: {
							type: "completion",
							search_analyzer: "str_search_analyzer",
							index_analyzer: "autocomplete",
							payloads: false
						}
					}
				}
			};
			break;

			default:
				reject({message: 'Wrong index'});
		}

		Search.indices.putMapping({index: "resources", type: index, body: body}, function (error, response) {
			if (error) {
				resolve(error, index, body);
			}
			else {
				resolve(response);
			}
		});
	});
};

 /**
  * @description
	* Restore every given documents in the index under the given type
	*
	* @param {Array} documents
	* @param {String} type - The specific type of the documents to restore.
	* Can be 'user', 'place' or 'community'
	*/
SearchMethods.restoreIndexDocuments = function (documents, type) {
	console.log('Got the ' + type + ' documents');
	return new Promise(function (resolve, reject) {
		for (var i = 0; i < documents.length; i++) {
			var id = documents[i]._id;
			// Get the place data
			var doc = documents[i];

			// Format the body for the index query
			var getIndexBody = Meteor.wrapAsync(SearchMethods.getIndexBody);
			var body = getIndexBody(type, doc);

			// Index the resource
			Search.index({
				index: 'resources',
				type: type,
				id: id, // Place id
				body: body
			}, function (error, response) {
				if (error) {
					reject();
				}
				else {
					// Check if we have indexed every documents
					if (documents.length === i) {
						resolve();
					}
				}
			});
		}
	});
};
