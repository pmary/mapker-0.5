Package.describe({
  name: 'pmary:tagsinput',
  version: '0.6.0',
  // Brief, one-line summary of the package.
  summary: 'Bootstrap Tags Input is a jQuery plugin providing a Twitter Bootstrap user interface for managing tags.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/timschlechter/bootstrap-tagsinput',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');
  
  api.addFiles(['tagsinput.js', 'tagsinput.css'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:tagsinput');
  api.addFiles('tagsinput-tests.js');
});
