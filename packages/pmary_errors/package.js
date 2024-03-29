Package.describe({
  name: 'pmary:errors',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'A pattern to display application errors to the user',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'errors.js',
    'errors_list.html',
    'errors.scss',
    'errors_list.js'
  ], ['client']);

  if (api.export)
    api.export('Errors');
});

Package.onTest(function(api) {
  api.use('pmary:errors', 'client');
  api.use(['tinytest', 'test-helpers'], 'client');

  api.addFiles('errors_tests.js', 'client');
});
