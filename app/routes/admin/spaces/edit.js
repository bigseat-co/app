import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';
import GetSpace from 'bigseat/gql/queries/get-space.graphql';
import { hash } from 'rsvp';
import Space from 'bigseat/models/space';

export default class AdminSpacesEditRoute extends Route {
  @queryManager apollo

  async model(params) {
   return hash({
     space: await this._findSpace(params.space_id)
   })
  }

  setupController(controller, model) {
    let space = this._buildSpace(model.space);

    super.setupController(controller, model);

    this.controllerFor('admin.spaces.edit').set('space', space);
  }

  _findSpace(id) {
    let payload = {
      query: GetSpace,
      variables: {
        id: id
      }
    };

    return this.apollo.query(payload, 'getSpace');
  }

  _buildSpace(space) {
    return new Space().setProperties({
      name: space.name,
      maximumPeople: space.maximumPeople,
      openHours: space.openHours.map(openHour => ({
        id: openHour.id,
        dayOfTheWeek: openHour.dayOfTheWeek,
        openTime: this._dropSeconds(openHour.openTime),
        closeTime: this._dropSeconds(openHour.closeTime)
      }))
    });
  }

  // 17:00:00 => 17:00
  _dropSeconds(time) {
    return time.split(':').slice(0, 2).join(':');
  }
}

