import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminSignupController extends Controller {
  @action
  submitForm() {
    this.transitionToRoute('admin.spaces');
  }
}
