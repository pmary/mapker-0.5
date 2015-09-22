Package.describe({
  name: 'mapker:places',
  version: '0.0.8',
  summary: 'Mapker places package',
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
    'lib/client/handlebars.js',
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
      'lib/client/templates/modals/create_place/create_place.html',
      'lib/client/templates/modals/create_place/create_place.scss',
      'lib/client/templates/modals/create_place/create_place.js',
      // Suggest place
      'lib/client/templates/modals/suggest_place/suggest_place.html',
      'lib/client/templates/modals/suggest_place/suggest_place.scss',
      'lib/client/templates/modals/suggest_place/suggest_place.js',
      // Confirm leave staff
      'lib/client/templates/modals/confirm_leave_staff/confirm_leave_staff.html',
      'lib/client/templates/modals/confirm_leave_staff/confirm_leave_staff.js',
      // Confirm remove staff member
      'lib/client/templates/profile/staff/modals/remove_staff_member/remove_staff_member.html',
      'lib/client/templates/profile/staff/modals/remove_staff_member/remove_staff_member.js',
    // Pages
      // Create a place page
      'lib/client/templates/add_your_place/add_your_place.html',
      'lib/client/templates/add_your_place/add_your_place.scss',
      'lib/client/templates/add_your_place/add_your_place.js',
      // Suggest a place page
      'lib/client/templates/suggest_a_place/suggest_a_place.html',
      'lib/client/templates/suggest_a_place/suggest_a_place.scss',
      'lib/client/templates/suggest_a_place/suggest_a_place.js'
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/places.js',
    'lib/methods.js',
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
