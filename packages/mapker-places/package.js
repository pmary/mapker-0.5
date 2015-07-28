Package.describe({
  name: 'mapker:places',
  version: '0.0.1',
  summary: 'Mapker places package',
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
    // Profile
      // Layout
      'lib/client/templates/profile/layout.html',
      'lib/client/templates/profile/layout.scss',
      'lib/client/templates/profile/layout.js',
        // About
        'lib/client/templates/profile/about/about.html',
        'lib/client/templates/profile/about/about.scss',
        'lib/client/templates/profile/about/about.js',
        // Machines
        'lib/client/templates/profile/machines/machines.html',
        'lib/client/templates/profile/machines/machines.js',
        // Popovers
        'lib/client/templates/profile/popovers/identity/identity.html',
        'lib/client/templates/profile/popovers/identity/identity.scss',
        'lib/client/templates/profile/popovers/identity/identity.js',
        'lib/client/templates/profile/popovers/social_profiles/social_profiles.html',
        'lib/client/templates/profile/popovers/social_profiles/social_profiles.scss',
        'lib/client/templates/profile/popovers/social_profiles/social_profiles.js',
        // Staff
        'lib/client/templates/profile/staff/staff.html',
        'lib/client/templates/profile/staff/staff.scss',
        'lib/client/templates/profile/staff/staff.js',
        'lib/client/templates/profile/staff/modals/add_staff_members/add_staff_members.html',
        'lib/client/templates/profile/staff/modals/add_staff_members/add_staff_members.scss',
        'lib/client/templates/profile/staff/modals/add_staff_members/add_staff_members.js',
        // Timetable
        'lib/client/templates/profile/timetable/timetable.html',
        'lib/client/templates/profile/timetable/timetable.scss',
        'lib/client/templates/profile/timetable/timetable.js',
    // Modals
      // Add place
      'lib/client/templates/modals/add_place/add_place.html',
      'lib/client/templates/modals/add_place/add_place.scss',
      'lib/client/templates/modals/add_place/add_place.js'
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/places.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export('Places');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:places');
  api.addFiles('places-tests.js');
});