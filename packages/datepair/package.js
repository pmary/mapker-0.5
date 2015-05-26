Package.describe({
  name: 'pmary:datepair',
  version: '0.4.7',
  // Brief, one-line summary of the package.
  summary: 'Datepair.js is a lightweight, modular javascript plugin for intelligently selecting date and time ranges, inspired by Google Calendar',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jonthornton/Datepair.js',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles(['datepair.min.js', 'jquery.datepair.min.js', 'bootstrap-datepicker.min.js'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:datepair');
  api.addFiles('datepair-tests.js');
});
