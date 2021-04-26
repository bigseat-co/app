import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';

// TODO - Rename for ListSpaces (convention)
import listSpaces from "../../../gql/queries/list-spaces.graphql";

export default class AdminSpacesIndexRoute extends Route {
  @queryManager apollo

  model() {
    return this.apollo.query({ query: listSpaces }, 'listSpaces').catch(error => alert(error));
  }

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('withRecords', null);
    }
  }
}
