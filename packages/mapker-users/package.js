Package.describe({
  name: 'mapker:users',
  version: '0.1.4',
  summary: 'Mapker users and permissions package',
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
    // Login / Signup / Forgot password
    'lib/client/templates/user_account/user_forgot_password.html',
    'lib/client/templates/user_account/user_forgot_password.js',
    'lib/client/templates/user_account/user_join.html',
    'lib/client/templates/user_account/user_join.js',
    'lib/client/templates/user_account/user_login.html',
    'lib/client/templates/user_account/user_login.js',
    // User profile
    'lib/client/templates/user_profile/user_profile_layout.html',
    'lib/client/templates/user_profile/user_profile_layout.scss',
    'lib/client/templates/user_profile/user_profile_layout.js',
    // Bio
    'lib/client/templates/user_profile/user_profile_bio/user_profile_bio.html',
    'lib/client/templates/user_profile/user_profile_bio/user_profile_bio.css',
    'lib/client/templates/user_profile/user_profile_bio/user_profile_bio.js',
    // Network
    'lib/client/templates/user_profile/user_profile_network/user_profile_network.html',
    'lib/client/templates/user_profile/user_profile_network/user_profile_network.scss',
    'lib/client/templates/user_profile/user_profile_network/user_profile_network.js',
    // Places
    'lib/client/templates/user_profile/user_profile_places/user_profile_places.html',
    'lib/client/templates/user_profile/user_profile_places/user_profile_places.scss',
    'lib/client/templates/user_profile/user_profile_places/user_profile_places.js',
    // Skills
    'lib/client/templates/user_profile/user_profile_skills/user_profile_skills.html',
    'lib/client/templates/user_profile/user_profile_skills/user_profile_skills.scss',
    'lib/client/templates/user_profile/user_profile_skills/user_profile_skills.js',
    // Events
    'lib/client/templates/user_profile/user_profile_events/user_profile_events.html',
    'lib/client/templates/user_profile/user_profile_events/user_profile_events.scss',
    'lib/client/templates/user_profile/user_profile_events/user_profile_events.js',
    // Communities
    'lib/client/templates/user_profile/user_profile_communities/user_profile_communities.html',
    'lib/client/templates/user_profile/user_profile_communities/user_profile_communities.scss',
    'lib/client/templates/user_profile/user_profile_communities/user_profile_communities.js',
      // Popovers
        // Identity
        'lib/client/templates/user_profile/popovers/identity/identity.html',
        'lib/client/templates/user_profile/popovers/identity/identity.scss',
        'lib/client/templates/user_profile/popovers/identity/identity.js',
        // Social profiles
        'lib/client/templates/user_profile/popovers/social_profiles/social_profiles.html',
        'lib/client/templates/user_profile/popovers/social_profiles/social_profiles.scss',
        'lib/client/templates/user_profile/popovers/social_profiles/social_profiles.js',
        // Location
        'lib/client/templates/user_profile/popovers/location/location.html',
        'lib/client/templates/user_profile/popovers/location/location.scss',
        'lib/client/templates/user_profile/popovers/location/location.js',
      // Modals
        // Create profile
        'lib/client/templates/user_profile/modals/create_profile/create_profile.html',
        'lib/client/templates/user_profile/modals/create_profile/create_profile.scss',
        'lib/client/templates/user_profile/modals/create_profile/create_profile.js',
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/methods.js',
    'lib/helpers.js',
    'lib/routes.js',
    'lib/collection_hooks.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export('Users');
});

Package.onTest(function(api) {
  api.use('xolvio:cucumber');
  api.use('mapker:users');
  api.addFiles([
    'tests/cucumber/package.json',
    'tests/cucumber/features/loging.feature'
  ], ['client', 'server']);
});
