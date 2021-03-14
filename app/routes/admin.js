import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminRoute extends Route {
  @service session

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'signin');
  }
}