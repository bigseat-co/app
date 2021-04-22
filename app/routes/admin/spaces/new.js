import Route from '@ember/routing/route';

class Space {
  name
  maximumPeople = 10
}

export default class AdminSpacesNewRoute extends Route {
  model() {
    return new Space();
  }
}
