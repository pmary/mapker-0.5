Package.describe({
  name: 'mapker:nichandle',
  version: '0.0.1',
  summary: 'Mapker Nic-Handle package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.addFiles([
    'lib/namespace.js',
    'lib/methods.js'
  ], ['client', 'server']);

  api.export('NicHandles');
});
