import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class SigninController extends Controller {
  @service auth;

  isProcessing = false

  @action
  submitForm() {
    this.set('isProcessing', true);

    later(this, function () {
      this.set('isProcessing', false);
      this.auth.signIn();
      this.transitionToRoute('admin');
    }, 2000);
  }
}
