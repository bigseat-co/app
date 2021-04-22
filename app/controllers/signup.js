import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import SignupMutation from '../gql/mutations/signup.graphql';
import SignupRequestValidation from '../validations/signup-request';

export default class SignupController extends Controller {
  @service apollo
  @service cookies
  @service intl
  @service notifications
  @service session

  SignupRequestValidation = SignupRequestValidation

  @tracked isProcessing = false

  @action
  async signup(changeset) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await changeset.validate()

    if (changeset.isInvalid) {
      this.isProcessing = false;
      return;
    }

    await changeset.save();

    try {
      await this._signup();
    } catch(error) {
      this._onSignupError(error);
      return;
    }

    try {
      await this._authenticate();
    } catch(error) {
      this._onAuthenticateError(error);
      return;
    }

    this.isProcessing = false;
    this.transitionToRoute('admin');
  }

  _signup() {
    return this.apollo.mutate({
      mutation: SignupMutation,
      variables: this._serialize(this.model)
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

  _authenticate() {
    let { email, password } = this.model;

    return this.session.authenticate('authenticator:bigseat', {
      email: email,
      password: password
    });
  }

  _onAuthenticateError(error) {
    this.isProcessing = false;
    this.transitionToRoute('signin');
  }

  _onSignupError(error) {
    let message = error.errors?.firstObject?.message || this.intl.t('errors.generic');

    this.isProcessing = false;
    this.notifications.clearAll().error(message);
  }
}
