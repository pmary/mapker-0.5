Package.describe({
  name: 'mapker:quill',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.1');

  var packages = [
    'deps',
    'underscore'
  ];

  api.use(packages, 'client');

  api.addFiles([
    'quill.js',
    'quill-base.css',
    'quill-snow.css',
    'custom.css',
    'export.js'
  ], 'client');

  api.export('Quill', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('quill');
  api.addFiles('quill-tests.js');
});
