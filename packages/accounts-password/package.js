Package.describe({
  summary: "Password support for accounts",
  // Note: 2.2.0-beta.3 was published during the Meteor 1.6 prerelease
  // process, so it might be best to skip to 2.3.x instead of reusing
  // 2.2.x in the future.
  version: "1.5.0"
});

Package.onUse(function(api) {
  api.use('npm-bcrypt', 'server');

  api.use([
    'accounts-base',
    'srp',
    'sha',
    'ejson',
    'ddp'
  ], ['client', 'server']);

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  api.use('email', ['server']);
  api.use('random', ['server']);
  api.use('check');
  api.use('underscore');
  api.use('ecmascript');

  api.addFiles('email_templates.js', 'server');
  api.addFiles('password_server.js', 'server');
  api.addFiles('password_client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['accounts-password', 'tinytest', 'test-helpers', 'tracker',
           'accounts-base', 'random', 'email', 'underscore', 'check',
           'ddp', 'ecmascript']);
  api.addFiles('password_tests_setup.js', 'server');
  api.addFiles('password_tests.js', ['client', 'server']);
  api.addFiles('email_tests_setup.js', 'server');
  api.addFiles('email_tests.js', 'client');
});
