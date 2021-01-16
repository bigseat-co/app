import EmberRouter from '@ember/routing/router';
import config from 'bigseat/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('admin', { path: '/' }, function () {
    this.route('rooms', function () {
      this.route('new');
      this.route('edit');
    });

    this.route('analytics', function () {});
    this.route('integrations');
    this.route('people', function () {});
    this.route('settings');
  });

  this.route('booking', function () {
    this.route('privacy');
    this.route('terms');
  });

  this.route('signup');
  this.route('signin');

  this.route('style-guide');

  this.route('not-found', { path: '/*path' });
});
