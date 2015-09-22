Package.describe({
  name: 'mapker:machines',
  version: '0.1.0',
  summary: 'Mapker machines package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {

  api.versionsFrom('1.2.0.1');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/namespace.js',
    'lib/helpers.js',
    'lib/machines.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/modals/add_machine/add_machine.html',
    'lib/client/templates/modals/add_machine/add_machine.js',
    'lib/client/templates/modals/add_machine/add_machine.scss'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export('Machines');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('mapker:machines');
  api.use('reactive-var');
  api.addFiles('machines-tests.js');
});
