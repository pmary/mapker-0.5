Package.describe({
  name: 'mapker:machines',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Mapker machines package',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'deps',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'handlebars',
    'session',
    'less',
    'sha'
  ], ['client']);

  api.imply('templating');

  api.addFiles([
    'lib/machines.js',
    'lib/namespace.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/modals/add_machine/add_machine.html',
    'lib/client/templates/modals/add_machine/add_machine.js',
    'lib/client/templates/modals/add_machine/add_machine.less'
  ], ['client']);

  api.export('Machines');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('mapker:machines');
  api.use('reactive-var')
  api.addFiles('machines-tests.js');
});
