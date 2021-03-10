import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminRoute extends Route {
  @service auth
  @service session

  beforeModel(transition) {
    // Why do I need the get?!
    this.get('session').requireAuthentication(transition, 'signin');

    /*if (!this.session.isAuthenticated) {
      return this.transitionTo('signin');
    }*/
  }
}