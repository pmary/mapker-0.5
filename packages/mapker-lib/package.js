Package.describe({
  name: 'mapker:lib',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Mapker libraries.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.2');

  var packages = [
    'accounts-password',      // https://atmospherejs.com/meteor/accounts-password
    'email',                  // https://atmospherejs.com/meteor/email
    'http',                   // https://atmospherejs.com/meteor/http
    'jquery',                 // https://atmospherejs.com/meteor/jquery
    'audit-argument-checks',  // https://atmospherejs.com/meteor/audit-argument-checks
    'iron:router@1.0.9',      // https://atmospherejs.com/iron/router
    'fourseven:scss@2.1.1',   // https://atmospherejs.com/fourseven/scss
    'babel-compiler@5.8.3_1', // https://atmospherejs.com/meteor/babel-compiler
    'twbs:bootstrap@3.3.5',   // https://atmospherejs.com/twbs/bootstrap
    'reactive-var'            // https://atmospherejs.com/meteor/reactive-var
  ];

  api.use(packages);

  api.imply(packages);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:lib');
});
