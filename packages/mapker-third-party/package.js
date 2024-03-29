Package.describe({
  name: 'mapker:third-party',
  version: '0.1.0',
  summary: 'Mapker third party librairies',
  git: 'https://github.com/pmary/mapker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');

  api.addFiles([
    // Selectize.js: https://github.com/brianreavis/selectize.js
    // Required globally
    'bower_components/sifter/sifter.js',
    'bower_components/microplugin/src/microplugin.js',
    'bower_components/selectize/dist/js/selectize.min.js',
    'bower_components/selectize/dist/css/selectize.css',
    'bower_components/selectize/dist/css/selectize.bootstrap3.css',
    // jQuery-Autocomplete: https://github.com/devbridge/jQuery-Autocomplete
    // Required globally
    'bower_components/devbridge-autocomplete/dist/jquery.autocomplete.min.js',
    // Datepair.js: https://github.com/jonthornton/Datepair.js
    // Required by mapker:places
    'bower_components/timepicker/jquery.timepicker.min.js',
    'bower_components/timepicker/jquery.timepicker.css',
    'bower_components/timepicker/lib/bootstrap-datepicker.css',
    'bower_components/datepair.js/dist/jquery.datepair.min.js',
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mapker:third-party');
  api.addFiles('third-party-tests.js');
});
