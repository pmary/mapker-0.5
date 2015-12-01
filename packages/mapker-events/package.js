Package.describe({
  name: 'mapker:events',
  version: '0.0.1',
  summary: '',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.2');

  var packages = [
    'mapker:lib',     // no dependencies
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    // Create an event page
    'lib/client/templates/create_an_event/create_an_event.html',
    'lib/client/templates/create_an_event/create_an_event.js',
    'lib/client/templates/create_an_event/create_an_event.scss',
    // Event profile layout
    'lib/client/templates/profile/layout.html',
    'lib/client/templates/profile/layout.js',
    'lib/client/templates/profile/layout.scss',
      // Popovers
        // Identity
        'lib/client/templates/profile/popovers/identity/identity.html',
        'lib/client/templates/profile/popovers/identity/identity.js',
        'lib/client/templates/profile/popovers/identity/identity.scss',
        // Social profiles
        'lib/client/templates/profile/popovers/social_profiles/social_profiles.html',
        'lib/client/templates/profile/popovers/social_profiles/social_profiles.js',
        'lib/client/templates/profile/popovers/social_profiles/social_profiles.scss',
      // About
      'lib/client/templates/profile/about/about.html',
      'lib/client/templates/profile/about/about.js',
      'lib/client/templates/profile/about/about.scss',
    // Modals
      // Create an event
      'lib/client/templates/modals/create_event/create_event.html',
      'lib/client/templates/modals/create_event/create_event.js',
      'lib/client/templates/modals/create_event/create_event.scss'
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/schema.js',
    'lib/routes.js',
    'lib/helpers.js',
    'lib/methods.js',
    'lib/collection_hooks.js'
  ], ['client', 'server']);

  api.export('Events');
});
