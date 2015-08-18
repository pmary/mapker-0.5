Package.describe({
  name: 'mapker:api',
  version: '0.0.1',
  summary: 'Mapker API package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  var packages = [
    'nimble:restivus@0.8.3',
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles('api.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:api');
  api.addFiles('api-tests.js');
});
