Package.describe({
  name: 'mapker:lib',
  version: '0.1.0',
  summary: 'Mapker libraries.',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');

  var packages = [
    'deps',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'handlebars',
    'session',
    'sha',
    'accounts-password',         // https://atmospherejs.com/meteor/accounts-password
    'email',                     // https://atmospherejs.com/meteor/email
    'http',                      // https://atmospherejs.com/meteor/http
    'jquery',                    // https://atmospherejs.com/meteor/jquery
    'check',                     // https://atmospherejs.com/meteor/check
    'reactive-var',              // https://atmospherejs.com/meteor/reactive-var
    'audit-argument-checks',     // https://atmospherejs.com/meteor/audit-argument-checks
    'pauloborges:mapbox',        // https://atmospherejs.com/pauloborges/mapbox
    'momentjs:moment',           // https://atmospherejs.com/momentjs/moment
    'peerlibrary:aws-sdk',       // https://atmospherejs.com/peerlibrary/aws-sdk
    'miktam:loggly',             // https://atmospherejs.com/miktam/loggly
    'aldeed:simple-schema',      // https://atmospherejs.com/aldeed/simple-schema
    'aldeed:collection2',        // https://atmospherejs.com/aldeed/collection2
    'aldeed:autoform',           // https://atmospherejs.com/aldeed/autoform
    'iron:router',               // https://atmospherejs.com/iron/router
    'alanning:roles',            // https://atmospherejs.com/alanning/roles
    'fourseven:scss',            // https://atmospherejs.com/fourseven/scss
    'twbs:bootstrap',            // https://atmospherejs.com/twbs/bootstrap
    'peppelg:bootstrap-3-modal', // https://atmospherejs.com/peppelg/bootstrap-3-modal
    //'juliancwirko:s-alert',    // https://atmospherejs.com/juliancwirko/s-alert
    'tap:i18n',                  // https://atmospherejs.com/tap/i18n-ui
    'tap:i18n-db',               // https://atmospherejs.com/tap/i18n-db
    'mapker:third-party'
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/core.js',
    'lib/utils.js',
    'lib/base.js'
  ], ['client', 'server']);

  api.export([
    'Mapker'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:lib');
});
