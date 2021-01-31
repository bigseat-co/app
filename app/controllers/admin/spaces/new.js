import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminSpacesNewController extends Controller {
  @action
  attemptUpload() {
    this.transitionToRoute('admin.spaces.edit');
  }
}
