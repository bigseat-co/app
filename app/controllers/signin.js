import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import SigninMutation from '../gql/mutations/signin.graphql';
import SigninRequestValidation from '../validations/signin-request';


export default class SigninController extends Controller {
  @service apollo
  @service intl
  @service notifications
  @service session

  SigninRequestValidation = SigninRequestValidation

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
      this._showErrorMessage();
      this.isProcessing = false;
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

  _showErrorMessage() {
    let message = this.intl.t('errors.invalid_email_or_password');

    this.notifications.clearAll().error(message);
  }
}
