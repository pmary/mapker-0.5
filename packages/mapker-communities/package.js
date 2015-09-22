Package.describe({
  name: 'mapker:communities',
  version: '0.0.3',
  summary: 'Mapker communities package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/client/templates/profile/layout.html',
    'lib/client/templates/profile/layout.js',
    'lib/client/templates/profile/layout.scss',
    // About tab
    'lib/client/templates/profile/about/about.html',
    'lib/client/templates/profile/about/about.js',
    'lib/client/templates/profile/about/about.scss',
    // Modals
      'lib/client/templates/modals/create_community/create_community.html',
      'lib/client/templates/modals/create_community/create_community.js',
      'lib/client/templates/modals/create_community/create_community.scss',
    // Pages
      // Create a community page
      'lib/client/templates/create_a_community/create_a_community.html',
      'lib/client/templates/create_a_community/create_a_community.scss',
      'lib/client/templates/create_a_community/create_a_community.js',
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/routes.js'
  ], ['client', 'server']);
});
