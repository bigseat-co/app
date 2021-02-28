import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';
import listSpaces from "../../../gql/queries/list-spaces.graphql";

export default class AdminSpacesIndexRoute extends Route {
  @queryManager apollo;

  model() {
    //return this.apollo.watchQuery({ query: listSpaces }, "space");
  }

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('withRecords', null);
    }
  }
}
