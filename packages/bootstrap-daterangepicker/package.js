Package.describe({
  name: 'mapker:bootstrap-daterangepicker',
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
  api.versionsFrom('1.2.1');

  api.use('ecmascript');

  var packages = [
    'momentjs:moment',
    'ecmascript'
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'node_modules/bootstrap-daterangepicker/daterangepicker.css',
    'node_modules/bootstrap-daterangepicker/daterangepicker.js',
    'custom.css'
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mapker:bootstrap-daterangepicker');
  api.addFiles('bootstrap-daterangepicker-tests.js');
});
