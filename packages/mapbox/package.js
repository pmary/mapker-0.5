Package.describe({
  name: 'pmary:mapbox',
  version: '2.2.1',
  // Brief, one-line summary of the package.
  summary: 'This is the Mapbox Javascript API, version 2.x. It\'s built as a Leaflet plugin. ',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mapbox/mapbox.js/',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use(['deps', 'underscore'], ['client']);
  api.addFiles(['mapbox.js', 'mapbox.css'], 'client');
  api.export('Mapbox', ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:mapbox');
  api.addFiles('mapbox-tests.js');
});
