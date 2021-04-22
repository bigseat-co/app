import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { w } from '@ember/string';
import { Changeset } from 'ember-changeset';
import CreateSpaceRequestValidation from '../../../validations/create-space-request';

export default class AdminSpacesNewController extends Controller {
  days = w("monday tuesday wednesday thursday friday saturday sunday")
  hours = w("00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 15 17 18 19 20 21 22 23")
  minutes = w("00 05 10 15 20 25 30 35 40 45 50 55")

  workingDays = w("monday tuesday wednesday thursday friday saturday sunday")

  @tracked workingDaysForEnd =  w("monday tuesday wednesday thursday friday saturday sunday")
  @tracked workingDayStart = 'monday'
  @tracked workingDayEnd = 'sunday'

  CreateSpaceRequestValidation = CreateSpaceRequestValidation

  @action
  attemptUpload() {
    this.transitionToRoute('admin.spaces.edit');
  }

  @action
  setWorkingDayStart(day) {
    this.workingDayStart = day;
  }

  @action
  setWorkingDayEnd(day) {
    this.workingDayEnd = day;
  }
}
