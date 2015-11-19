/**
 * @namespace ElasticSearch
 * @summary Indexes set up and helpers
 * @see http://blog.qbox.io/quick-and-dirty-autocomplete-with-elasticsearch-completion-suggest for autocomplete exemple
 */
Elasticsearch = Npm.require('elasticsearch');

// Check if we are in production or development environement
if (process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
	// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
	Search = new Elasticsearch.Client({
		host: 'https://site:94bef02eac187cc0bf8ee704318f1144@kili-eu-west-1.searchly.com'
	});
}
else {
	// Connect to just a single seed node, and use sniffing to find the rest of the cluster.
	Search = new Elasticsearch.Client({
		host: 'https://site:547996b6b8262ee6259f65e4c4095fe8@fili-us-east-1.searchly.com'
	});
}
