import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';
import getSpace from 'bigseat/gql/queries/get-space.graphql'; // TODO - Should be called GetSpace
import SpaceForm from 'bigseat/models/space-form';

export default class AdminSpacesEditRoute extends Route {
  @queryManager apollo

  async model(params) {
    let space = await this._findSpace(params.space_id);

    let spaceForm = new SpaceForm().setProperties({
      name: space.name,
      maximumPeople: space.maximumPeople
    });

    return { space, spaceForm };
  }

  _findSpace(id) {
    let payload = {
      query: getSpace,
      variables: {
        id: id
      }
    };

    return this.apollo.query(payload, 'getSpace');
  }
}
