/**
 * @namespace ElasticSearch
 * @summary Indexes set up and helpers
 * @see http://blog.qbox.io/quick-and-dirty-autocomplete-with-elasticsearch-completion-suggest for autocomplete exemple
 */
Elasticsearch = Npm.require('elasticsearch');

// Check if we are in production or development environement
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
	// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
	Search = new Elasticsearch.Client({
		host: Meteor.settings.elastic.prod.host
	});
}
else {
	// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
	Search = new Elasticsearch.Client({
		host: Meteor.settings.elastic.dev.host
	});
}
