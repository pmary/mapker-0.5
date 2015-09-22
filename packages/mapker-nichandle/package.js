Package.describe({
  name: 'mapker:nichandle',
  version: '0.1.0',
  summary: 'Mapker Nic-Handle package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/namespace.js',
    'lib/methods.js'
  ], ['client', 'server']);

  api.export('NicHandles');
});
