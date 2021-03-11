import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminRoute extends Route {
  @service session

  beforeModel(transition) {
    // TODO - Try without get
    this.get('session').requireAuthentication(transition, 'signin');
  }
}