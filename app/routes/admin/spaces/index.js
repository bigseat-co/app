import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';
import ListSpaces from 'bigseat/gql/queries/list-spaces.graphql';

export default class AdminSpacesIndexRoute extends Route {
  @queryManager apollo

  model() {
    return this.apollo.watchQuery({ query: ListSpaces }, 'listSpaces').catch(error => alert(error));
  }
}
