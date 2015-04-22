Package.describe({
  name: 'pmary:elasticsearch',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Elasticsearch wrapper',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'elasticsearch': '4.0.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles(['elasticsearch.js'], 'server');
  api.export('Elasticsearch', ['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:elasticsearch');
  api.addFiles('elasticsearch-tests.js');
});
