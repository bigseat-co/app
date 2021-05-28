import ApolloService from 'ember-apollo-client/services/apollo';
import { inject as service } from '@ember/service';
import { setContext } from '@apollo/client/link/context';
import { Promise } from 'rsvp';
import { InMemoryCache } from '@apollo/client/core';

export default class OverriddenApollo extends ApolloService {
  @service currentUser

  cache() {
    return new InMemoryCache({
      typePolicies: {
        DashboardSpace: {
          fields: {
            openHours: {
               merge(existing, incoming) {
                return incoming;
              }
            }
          }
        }
      }
    });
  }

  link() {
    let httpLink = super.link();

    let authLink = setContext((request, context) => {
      return this._runAuthorize(request, context);
    });
    return authLink.concat(httpLink);
  }

  _runAuthorize() {
    return new Promise((success) => {
      let headers = {};

      this.currentUser.load();

      let apiKey = this.currentUser?.user?.apiKey;

      headers['Authorization'] = apiKey ? `Bearer ${apiKey}` : '';

      success({ headers });
    });
  }
}