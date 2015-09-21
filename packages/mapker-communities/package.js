Package.describe({
  name: 'mapker:communities',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
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
      'lib/client/templates/modals/create_community/create_community.scss'
  ], ['client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/routes.js'
  ], ['client', 'server']);
});
