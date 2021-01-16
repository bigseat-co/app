import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class AdminSiginController extends Controller {
  @service auth;

  isProcessing = false

  @action
  submitForm() {
    this.set('isProcessing', true);

    later(this, function () {
      this.set('isProcessing', false);
      this.auth.signIn();
      this.transitionToRoute('admin.rooms');
    }, 2000);
  }
}
