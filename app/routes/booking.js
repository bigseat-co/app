import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { queryManager } from 'ember-apollo-client';
import ListSpacesFromBookings from 'bigseat/gql/queries/list-spaces-from-bookings.graphql';

export default class BookingRoute extends Route {
  @queryManager apollo

  get now() {
    return new Date().toISOString();
  }

  get endOfDay() {
    let date = new Date();
    date.setHours(23, 59, 59, 999);

    return date.toISOString();
  }

  model(params) {
    let payload = {
      query: ListSpacesFromBookings,
      variables: {
        startAt: this.now,
        endAt: this.endOfDay,
        organizationId: params.organization_id
      }
    };

    return this.apollo.query(payload, 'listSpacesFromBookings');
  }
}