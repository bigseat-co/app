import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import Base from 'ember-simple-auth/authenticators/base';
import SigninMutation from '../gql/mutations/signin.graphql';

export default class BigseatAuthenticator extends Base {
  @service apollo;

  restore(data) {
    return this._validate(data) ? Promise.resolve(data) : Promise.reject();
  }

  authenticate({ email, password }) {
    return new Promise((resolve, reject) => {
      this.apollo.mutate({
        mutation: SigninMutation,
        variables: { email: email, password: password }
      })
      .then((response) => {
        run(null, resolve, response);
      })
      .catch((error) => {
        run(null, reject, error);
      });
    });
  }

  invalidate(data) {
    return Promise.resolve(); // no-op
  }

  _validate(data) {
    // TODO - Implement
    return true;
  }
}