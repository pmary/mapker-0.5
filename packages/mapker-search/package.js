Package.describe({
  name: 'mapker:search',
  version: '0.1.0',
  summary: 'Mapker search package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Npm.depends({
  'elasticsearch': '8.0.1'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');

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
    // Communities search
    'lib/client/template/search_communities/search_communities.html',
    'lib/client/template/search_communities/search_communities.scss',
    'lib/client/template/search_communities/search_communities.js',
    // Event search
    'lib/client/template/search_events/search_events.html',
    'lib/client/template/search_events/search_events.scss',
    'lib/client/template/search_events/search_events.js'
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/routes.js',
    'lib/methods.jsx'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/init.jsx'
  ], ['server']);

  api.export('Search');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:search');
  api.addFiles('search-tests.js');
});
