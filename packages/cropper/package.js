Package.describe({
  name: 'pmary:cropper',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.addFiles(['cropper.js', 'cropper.css'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pmary:cropper');
  api.addFiles('cropper-tests.js');
});
