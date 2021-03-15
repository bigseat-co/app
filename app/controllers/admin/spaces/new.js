import Controller from '@ember/controller';
import { action } from '@ember/object';
import { w } from '@ember/string';

export default class AdminSpacesNewController extends Controller {
  days = w("monday tuesday wednesday thursday friday saturday sunday")
  hours = w("00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 15 17 18 19 20 21 22 23")
  minutes = w("00 05 10 15 20 25 30 35 40 45 50 55")

  @action
  attemptUpload() {
    this.transitionToRoute('admin.spaces.edit');
  }
}
