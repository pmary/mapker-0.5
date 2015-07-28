Package.describe({
  name: 'mapker:users',
  version: '0.0.1',
  summary: 'Mapker users and permissions package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.2');

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
    'lib/client/templates/user_profile/user_profile_bio/user_profile_bio.html',
    'lib/client/templates/user_profile/user_profile_bio/user_profile_bio.css',
    'lib/client/templates/user_profile/user_profile_bio/user_profile_bio.js',
    'lib/client/templates/user_profile/user_profile_network/user_profile_network.html',
    'lib/client/templates/user_profile/user_profile_network/user_profile_network.scss',
    'lib/client/templates/user_profile/user_profile_network/user_profile_network.js',
    'lib/client/templates/user_profile/user_profile_places/user_profile_places.html',
    'lib/client/templates/user_profile/user_profile_places/user_profile_places.scss',
    'lib/client/templates/user_profile/user_profile_places/user_profile_places.js',
    'lib/client/templates/user_profile/user_profile_skills/user_profile_skills.html',
    'lib/client/templates/user_profile/user_profile_skills/user_profile_skills.css',
    'lib/client/templates/user_profile/user_profile_skills/user_profile_skills.js'
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
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
