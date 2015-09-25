Package.describe({
  name: 'mapker:core',
  version: '0.7.3',
  summary: 'Mapker core package',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');

  var packages = [
    'mapker:lib',         // no dependencies
    'mapker:users',       // lib
    'mapker:places',      // lib
    'mapker:machines',    // lib
    'mapker:search',      // lib
    'mapker:communities', // lib
    'mapker:api',         // nimble:restivus
    'mapker:communities', // lib
    'mapker:machines',    // lib
    'mapker:nichandle',   // lib
    'mapker:i18n',        // lib
    'mapker:third-party'  // lib
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/client/handlebars.js',
    'lib/client/main.html',
    'lib/client/main.scss',
    'lib/client/main.js',
    // Administration
    'lib/client/templates/administration/admin_main.html',
    'lib/client/templates/administration/admin_places.html',
    'lib/client/templates/administration/admin_place_edit/admin_place_edit.html',
    'lib/client/templates/administration/admin_place_edit/admin_place_edit.js',
    'lib/client/templates/administration/admin_settings/admin_settings.html',
    'lib/client/templates/administration/admin_settings/admin_settings.js',
    'lib/client/templates/administration/taxons/admin_taxons.html',
    'lib/client/templates/administration/taxons/admin_taxons.js',
    'lib/client/templates/administration/taxons/add/admin_add_taxon.html',
    'lib/client/templates/administration/taxons/add/admin_add_taxon.js',
    'lib/client/templates/administration/admin_users/admin_users.html',
    'lib/client/templates/administration/admin_users/admin_users.js',
    'lib/client/templates/administration/admin_users/edit/admin_user_edit.html',
    'lib/client/templates/administration/admin_users/edit/admin_user_edit.js',
    'lib/client/templates/administration/sidebar/sidebar.html',
    'lib/client/templates/administration/sidebar/sidebar.css',
    'lib/client/templates/administration/sidebar/sidebar.js',
    // Footer
    'lib/client/templates/footer/footer.html',
    'lib/client/templates/footer/footer.scss',
    'lib/client/templates/footer/footer.js',
    // Home
    'lib/client/templates/home/home.html',
    'lib/client/templates/home/home.scss',
    'lib/client/templates/home/home.js',
    // Includes
    'lib/client/templates/includes/404.html',
    'lib/client/templates/includes/access_denied.html',
    'lib/client/templates/includes/loader.html',
    // Legal
    'lib/client/templates/legal/dmca/dmca.html',
    'lib/client/templates/legal/privacy/privacy.html',
    'lib/client/templates/legal/terms_of_service/terms_of_service.html',
    // Primary navbar
    'lib/client/templates/primary_navbar/primary_navbar.html',
    'lib/client/templates/primary_navbar/primary_navbar.scss',
    'lib/client/templates/primary_navbar/primary_navbar.js',
    'lib/client/templates/primary_navbar/notifications/notifications.html',
    'lib/client/templates/primary_navbar/notifications/notifications.scss',
    'lib/client/templates/primary_navbar/notifications/notifications.js',
    // Modals
      // Layout
      'lib/client/templates/modals/modal.html',
      'lib/client/templates/modals/modal.js',
      // Avatar
      'lib/client/templates/modals/avatar/avatar.html',
      'lib/client/templates/modals/avatar/avatar.scss',
      'lib/client/templates/modals/avatar/avatar.js',
      // Cover
      'lib/client/templates/modals/cover/cover.html',
      'lib/client/templates/modals/cover/cover.css',
      'lib/client/templates/modals/cover/cover.js',
      // Login required
      'lib/client/templates/modals/login_required/login_required.html',
      'lib/client/templates/modals/login_required/login_required.scss',
      'lib/client/templates/modals/login_required/login_required.js',
      // Send message
      'lib/client/templates/modals/send_message/send_message.html',
      'lib/client/templates/modals/send_message/send_message.js'
  ], ['client']);

  /*api.addFiles([
    'public/images/home/avatar-place-big.png',
    'public/images/home/avatar-skill-big.png',
    'public/images/search-skills/bg.png',
    'public/images/avatar-place-default.png',
    'public/images/avatar-user-default.png',
    'public/images/fond-cover-place.png',
    'public/images/fond-cover-skills.png',
    'public/images/loader.gif',
    'public/images/logo-mapker-dark.png',
    'public/images/logo-mapker-light.png',
    'public/images/map-pins-sprite.png',
    'public/images/picto-zoom-to.png',
    'public/images/places-search-background.jpg',
    'public/images/search-places-icon.png',
    'public/images/search-skills-icon.png',
    'public/images/share-projects.jpg',
    'public/images/skills-search-background.jpg',
    'public/images/social-icons-sprite-25x25.png',
    'public/images/social_icons_transp.svg',
    'public/images/spinner.gif'
  ], ['client']);*/

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/auth.service.js',
    'lib/server/methods.js'
  ], ['server']);

  api.addFiles([
    'lib/startup.js',
    'lib/namespace.js',
    'lib/helpers.js',
    'lib/routes.js',
    'lib/messages.js',
    'lib/notifications.js',
    'lib/taxons.js'
  ], ['client', 'server']);

  api.export('Core');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:core');
  api.addFiles('core-tests.js');
});
