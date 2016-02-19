Package.describe({
  name: 'grmmph:meteor-drag-event',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Add drag events by extending Blaze event handlers',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/grmmph/meteor-drag-event',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('blaze');
  api.addFiles('meteor-drag-event.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('grmmph:meteor-drag-event');
  api.addFiles('meteor-drag-event-tests.js');
});
