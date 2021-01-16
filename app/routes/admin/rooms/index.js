import Route from '@ember/routing/route';

export default class AdminRoomsIndexRoute extends Route {
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('withRecords', null);
    }
  }
}
