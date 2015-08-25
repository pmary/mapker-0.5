Package.describe({
  name: 'mapker:search',
  version: '0.0.3',
  summary: 'Mapker search package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Npm.depends({
  'elasticsearch': '6.0.0'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.3');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    // Place search
    'lib/client/template/search_places/search_places.html',
    'lib/client/template/search_places/search_places.scss',
    'lib/client/template/search_places/search_places.js',
    // Skills search
    'lib/client/template/search_skills/search_skills.html',
    'lib/client/template/search_skills/search_skills.scss',
    'lib/client/template/search_skills/search_skills.js',
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/methods.js'
  ], ['server']);

  api.export('Search');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:search');
  api.addFiles('search-tests.js');
});
