import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminRoute extends Route {
  @service auth;

  beforeModel() {
    if (!this.auth.isSignedIn()) {
      return this.transitionTo('signin');
    }
  }
}