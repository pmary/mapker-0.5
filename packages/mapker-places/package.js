Package.describe({
  name: 'mapker:places',
  version: '0.0.1',
  summary: 'Mapker places package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.2');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/namespace.js',
    'lib/places.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export('Machines');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:places');
  api.addFiles('places-tests.js');
});
