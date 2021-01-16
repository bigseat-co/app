import Route from '@ember/routing/route';

export default class AdminPeopleIndexRoute extends Route {
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('withRecords', null);
    }
  }
}
