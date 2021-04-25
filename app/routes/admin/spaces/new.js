import Route from '@ember/routing/route';

class Space {
  name
  maximumPeople
}

export default class AdminSpacesNewRoute extends Route {
  model() {
    return new Space();
  }
}
