import EmberRouter from '@ember/routing/router';
import config from 'bigseat/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  /**
   * Admin
   */
  this.route('admin', { path: '/' }, function () {
    this.route('analytics', function () {
      // Implicit index route automatically defined
    });

    this.route('billing', function() {
      this.route('index');
    });

    this.route('configure-checkin');

    this.route('spaces', function () {
      this.route('new');
      this.route('edit');
    });

    this.route('plugins', function () {
      this.route('slack', function () {
        this.route('teams', function () {
          this.route('new');
        });
      });
    });

    this.route('people', function () {
      // Implicit index route automatically defined
    });

    this.route('settings', function () {
      this.route('security');
      this.route('danger-zone');
    });
  });

  /**
   * Booking
   */
  this.route('booking', function () {
    this.route('privacy');
    this.route('terms');
  });

  /**
   * Checkin
   */
  this.route('checkin', function () {
    // Implicit index route automatically defined
  });

  /**
   * Root
   */
  this.route('not-found', { path: '/*path' });

  this.route('signin');
  this.route('signup');
  this.route('style-guide');
});
