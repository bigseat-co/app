import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { w } from '@ember/string';
import { inject as service } from '@ember/service';
import SpaceValidation from '../../../validations/space';
import CreateSpaceMutation from '../../../gql/mutations/create-space.graphql';
import listSpaces from "../../../gql/queries/list-spaces.graphql";

export default class AdminSpacesNewController extends Controller {
  SpaceValidation = SpaceValidation
  isProcessing = false

  days = w("monday tuesday wednesday thursday friday saturday sunday")
  hours = w("00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 15 17 18 19 20 21 22 23")
  minutes = w("00 05 10 15 20 25 30 35 40 45 50 55")

  workingDays = w("monday tuesday wednesday thursday friday saturday sunday")

  @service apollo
  @service notifications
  @service intl

  @tracked workingDaysForEnd =  w("monday tuesday wednesday thursday friday saturday sunday")
  @tracked workingDayStart = 'monday'
  @tracked workingDayEnd = 'sunday'

  @action
  async create(changeset) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await changeset.validate();

    if (changeset.isInvalid) {
      this._onChangesetInvalid();
      return;
    }

    await changeset.save();

    try {
      await this._create();
    } catch(error) {
      this._onCreateError(error);
      return;
    }

    this.isProcessing = false;

    this.transitionToRoute('admin.spaces');
  }

  _create() {
    return this.apollo.mutate({
      mutation: CreateSpaceMutation,
      variables: {
        name: this.model.name,
        maximumPeople: parseInt(this.model.maximumPeople),
        dailyCheckin: false,
        openHours: []
      },
      refetchQueries: [{ query: listSpaces }],
      awaitRefetchQueries: true
    });
  }

  _onChangesetInvalid() {
    let message = 'Some of the informations you entered are incorrect';

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }

  _onCreateError(error) {
    let message = this.intl.t('errors.generic');

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }

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
