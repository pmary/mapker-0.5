Package.describe({
  name: 'pmary:selectize',
  version: '0.12.1',
  // Brief, one-line summary of the package.
  summary: 'Selectize is an extensible jQuery-based custom <select> UI control. It\'s useful for tagging, contact lists, country selectors, and so on. It clocks in at around ~7kb (gzipped). The goal is to provide a solid & usable experience with a clean and powerful API.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/brianreavis/selectize.js',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles(['selectize.js', 'selectize.bootstrap3.css'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:selectize');
  api.addFiles('selectize-tests.js');
});
