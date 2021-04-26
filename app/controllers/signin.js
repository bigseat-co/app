import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import SigninMutation from 'bigseat/gql/mutations/signin.graphql';
import SigninFormValidation from 'bigseat/validations/signin-form';

export default class SigninController extends Controller {
  SigninFormValidation = SigninFormValidation

  @service apollo
  @service intl
  @service notifications
  @service session

  @tracked isProcessing = false

  @action
  async signin(changeset) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await changeset.validate();

    if (changeset.isInvalid) {
      this.isProcessing = false;
      return;
    }

    await changeset.save();

    try {
      await this._authenticate();
    } catch(error) {
      this._onAuthenticateError(error);
      return;
    }

    this.isProcessing = false;
    this.transitionToRoute('admin');
  }

  _authenticate() {
    let { email, password } = this.model;

    return this.session.authenticate('authenticator:bigseat', {
      email: email,
      password: password
    });
  }

  _onAuthenticateError() {
    let message = this.intl.t('errors.invalid_email_or_password');

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }
}
