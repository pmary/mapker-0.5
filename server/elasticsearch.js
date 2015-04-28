/**
 * @namespace ElasticSearch
 * @summury Indexes set up and helpers
 */

// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
ES = new Elasticsearch.Client({
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
		ES.create({
			index: 'resources',
			type: 'user',
			id: users[i]._id,
			body: {
		    	name: users[i].profile.fullname
			}
		}, function (error, response) {
			
		});
	};
}

/**
 * @summary Delete all the indices
 */
var deleteAllIndices = function() {
	ES.indices.delete({index: _all});
}

/**
 * @summary Setup the 'resources' indice and map the user and place types
 */
var setupIndicesAndMapping = function() {
	// Create the elasticsearch 'resources' incice
	ES.indices.create({ index: "resources" }, function() {
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
					activities: {"type" : "string"}
				}
			}
		};
		ES.indices.putMapping({index:"resources", type:"place", body:placesBody});

		var usersBody = {
			user: {
				properties:{
					id: {"type" : "string"},			// The MongoDB id
					name: {"type" : "string"},			// Fullname field
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
					skills: {
						"type": "object",
						"properties": {
							title: {"type" : "string"}
						}
					}
				}
			}
		};
		ES.indices.putMapping({index:"resources", type:"user", body:usersBody});
	});
}

/*****************************************************************************/
/* Methods */
/*****************************************************************************/
Meteor.methods({
	/**
	 * @summary Create a new user document in the 'resource' ES index
	 * @param {string} id The document id from MongoDB
	 */
	createUserDocument: function(id) {
		check(id, String);

		// Get the user data
		var user = Meteor.users.findOne({ "_id": id });
		if (!user) return;

		ES.create({
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
		check(Meteor.userId(), String);

		// Get the user data
		var user = Meteor.users.findOne({ "_id": id });
		if (!user) return;
	},
	/**
	 * @summary Delete a user document from the 'resource' ES index
	 * @param {string} id The document id from MongoDB
	 */
	deletUsereDocument: function(id) {
		check(Meteor.userId(), String);
	}
});