/* Information about this package */
Package.describe({
  summary: "What this does",
  // Version number.
  version: "0.0.1",
  // Optional.  Default is package directory name.
  name: "pmary:focus-point",
  // Optional github URL to your source repository.
  //git: "https://github.com/something/something.git",
});

/* This defines your actual package */
Package.onUse(function (api) {
  // If no version is specified for an 'api.use' dependency, use the
  // one defined in Meteor 0.9.0.
  api.versionsFrom('1.0.3');
  // Files to export
  api.addFiles('./client/focuspoint.css', 'client');
  api.addFiles('./client/jquery.focuspoint.helpertool.js', 'client');
  api.addFiles('./client/jquery.focuspoint.js', 'client');
  // Use Underscore package, but only on the server.
  // Version not specified, so it will be as of Meteor 0.9.0.
  /*api.use('underscore', 'server');
  // Use application-configuration package, version 1.0.0 or newer.
  api.use('application-configuration@1.0.0');
  // Give users of this package access to the Templating package.
  api.imply('templating')
  // Export the object 'Email' to packages or apps that use this package.
  api.export('Email', 'server');
  // Specify the source code for the package.
  api.addFiles('email.js', 'server');*/
});

/* This defines the tests for the package */
/*Package.onTest(function (api) {
  // Sets up a dependency on this package
  api.use('username:package-name');
  // Allows you to use the 'tinytest' framework
  api.use('tinytest@1.0.0');
  // Specify the source code for the package tests
  api.addFiles('email_tests.js', 'server');
});*/

/* This lets you use npm packages in your package*/
Npm.depends({
});