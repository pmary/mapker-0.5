Package.describe({
  name: 'mapker:i18n',
  version: '0.0.1',
  summary: 'Mapker i18n package, used internally.',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.2');

  api.use(['mapker:lib']);

  api.use(["session"], "client");

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.addFiles([
    'i18n.js',
    'lib/countries.js',
    'lib/fixtures.js'
  ], ['client', 'server']);

  api.export([
    'i18n',
    'Countries'
  ]);
});
