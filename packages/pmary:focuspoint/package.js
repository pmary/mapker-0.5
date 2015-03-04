Package.describe({
  name: 'pmary:focuspoint',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.addFiles('./client/focuspoint.css', 'client');
  api.addFiles('./client/jquery.focuspoint.helpertool.js', 'client');
  api.addFiles('./client/jquery.focuspoint.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:focuspoint');
  api.addFiles('pmary:focuspoint-tests.js');
});
