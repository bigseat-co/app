import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SigninController extends Controller {
  @service apollo
  @service intl
  @service notifications
  @service session

  @action
  async signin(request) {
    try {
      await this._authenticate(request);
    } catch(error) {
      this._onAuthenticateError(error);
      return;
    }

    this.transitionToRoute('admin');
  }

  _authenticate(request) {
    let { email, password } = request;

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
