Package.describe({
  name: 'mapker:users',
  version: '0.0.1',
  summary: 'Mapker users and permissions package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.2');

  api.addFiles([
  ], ['client']);

  api.addFiles([
    'lib/namespace.js'
  ], ['client', 'server']);

  api.addFiles([
  ], ['server']);

  api.export('Users');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:users');
  api.addFiles('users-tests.js');
});
