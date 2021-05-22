import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';
import ListPeople from 'bigseat/gql/queries/list-people.graphql';
import hash from 'rsvp';

export default class AdminPeopleIndexRoute extends Route {
  @queryManager apollo

  async model() {
    return this.apollo.query({ query: ListPeople }, 'listPeople').catch(error => alert(error));
  }

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('withRecords', null);
    }
  }
}
