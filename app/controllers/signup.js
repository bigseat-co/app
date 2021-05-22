import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SignupMutation from '../gql/mutations/signup.graphql';

export default class SignupController extends Controller {
  @service apollo
  @service intl
  @service notifications
  @service session

  @action
  async signup(request) {
    try {
      await this._signup(request);
    } catch(error) {
      this._onSignupError(error);
      return;
    }

    try {
      await this._authenticate(request);
    } catch(error) {
      this._onAuthenticateError(error);
      return;
    }

    this.transitionToRoute('admin');
  }

  _signup(request) {
    return this.apollo.mutate({
      mutation: SignupMutation,
      variables: this._serialize(request)
    });
  }

  _serialize(attrs) {
    return {
      email: attrs.email,
      firstName: attrs.firstName,
      lastName: attrs.lastName,
      organization: {
        name: attrs.organizationName
      },
      password: attrs.password
    };
  }

  _authenticate(request) {
    let { email, password } = request;

    return this.session.authenticate('authenticator:bigseat', {
      email: email,
      password: password
    });
  }

  _onAuthenticateError(error) {
    this.transitionToRoute('signin');
  }

  _onSignupError(error) {
    let message = error.errors?.firstObject?.message || this.intl.t('errors.generic');

    this.notifications.clearAll().error(message);
  }
}
