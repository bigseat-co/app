import Route from '@ember/routing/route';

class SpaceRequest {
  name = 'yolo'
  maximumPeople
}

export default class AdminSpacesNewRoute extends Route {
  model() {
    return new SpaceRequest();
  }
}
