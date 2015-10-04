Package.describe({
  name: 'mapker:communities',
  version: '0.1.2',
  summary: 'Mapker communities package',
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
    'lib/client/templates/profile/layout.html',
    'lib/client/templates/profile/layout.js',
    'lib/client/templates/profile/layout.scss',
    // Popovers
    'lib/client/templates/profile/popovers/identity/identity.html',
    'lib/client/templates/profile/popovers/identity/identity.scss',
    'lib/client/templates/profile/popovers/identity/identity.js',
    'lib/client/templates/profile/popovers/social_profiles/social_profiles.html',
    'lib/client/templates/profile/popovers/social_profiles/social_profiles.scss',
    'lib/client/templates/profile/popovers/social_profiles/social_profiles.js',
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
      'lib/client/templates/create_a_community/create_a_community.js'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.addFiles([
    'lib/namespace.js',
    'lib/routes.js',
    'lib/helpers.js',
    'lib/methods.js'
  ], ['client', 'server']);

  api.export('Communities');
});
