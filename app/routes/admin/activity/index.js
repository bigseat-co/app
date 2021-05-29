import Route from '@ember/routing/route';

export default class AdminActivityIndexRoute extends Route {

  beforeModel() {
    this.replaceWith('admin.activity.checkins');
  }
}
