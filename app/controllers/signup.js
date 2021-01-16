import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SignupController extends Controller {
  isShowingTerms = false
  isShowingPrivacy = false

  @action
  submitForm() {
    this.transitionToRoute('admin');
  }

  @action
  toggleTerms() {
    this.toggleProperty('isShowingTerms');
  }

  @action
  togglePrivacy() {
    this.toggleProperty('isShowingPrivacy');
  }
}
