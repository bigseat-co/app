import Route from '@ember/routing/route';

export default class AdminIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('admin.rooms');
  }
}
