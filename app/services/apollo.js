import ApolloService from 'ember-apollo-client/services/apollo';
import { inject as service } from '@ember/service';
import { setContext } from '@apollo/client/link/context';
import { Promise } from 'rsvp';

export default class OverriddenApollo extends ApolloService {
  @service cookies;

  link() {
    let httpLink = super.link();

    let authLink = setContext((request, context) => {
      return this._runAuthorize(request, context);
    });
    return authLink.concat(httpLink);
  }

  _runAuthorize() {
    return new Promise(success => {
      let headers = {};
      let token = this.cookies.read('token');
      headers['Authorization'] = token ? `Bearer ${token}` : '';

      success({ headers });
    });
  }
}