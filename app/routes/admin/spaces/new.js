import Route from '@ember/routing/route';
import SpaceForm from 'bigseat/models/space-form';

export default class AdminSpacesNewRoute extends Route {
  model() {
    return {
      spaceForm: new SpaceForm()
    };
  }
}
