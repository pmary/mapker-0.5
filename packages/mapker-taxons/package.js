Package.describe({
  name: 'mapker:taxons',
  version: '0.0.1',
  summary: '',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.1');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.addFiles([
    'lib/namespace.js'
  ], ['client', 'server']);

  api.export('Taxons');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mapker:taxons');
  api.addFiles('taxons-tests.js');
});
