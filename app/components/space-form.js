import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import SpaceFormValidations from '../validations/space-form';
import lookupValidator from 'ember-changeset-validations';
import { isPresent } from '@ember/utils';

const DAYS_OF_THE_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_OPEN_TIME = '08:00';
const DEFAULT_CLOSE_TIME = '17:00';

export default class SpaceForm extends Component {
  @tracked isProcessing
  @service intl
  @service notifications

  constructor() {
    super(...arguments);

    this.changeset = new Changeset(this.args.model, lookupValidator(SpaceFormValidations), SpaceFormValidations);
  }

  get daysOfTheWeek() {
    return DAYS_OF_THE_WEEK.map(day => ({
      id: day,
      label: day.charAt(0),
      isActive: this.isOpen(day)
    }));
  }

  get openHours() {
    let openHours = this.changeset.get('openHours') || [];

    return openHours.sort((a, b) => {
      return DAYS_OF_THE_WEEK.indexOf(a.dayOfTheWeek) - DAYS_OF_THE_WEEK.indexOf(b.dayOfTheWeek);
    });
  }

  get isClosedEveryDay() {
    return this.daysOfTheWeek.every(dayOfTheWeek => !dayOfTheWeek.isActive);
  }

  isOpen(dayOfTheWeek) {
    let openHour = this.openHours.find(openHour => openHour.dayOfTheWeek === dayOfTheWeek);

    return isPresent(openHour);
  }

  @action
  async submit() {
    this.isProcessing = true;

    await this.changeset.validate()

    if (this.changeset.isInvalid) {
      this._onChangesetInvalid();
      return;
    }

    await this.changeset.save();
    await this.args.onSubmit(this.changeset);

    this.isProcessing = false;
  }

  @action
  addOpenHours(dayOfTheWeek) {
    this.changeset.set('openHours', [...this.openHours, {
      dayOfTheWeek: dayOfTheWeek,
      openTime: DEFAULT_OPEN_TIME,
      closeTime: DEFAULT_CLOSE_TIME
    }]);
  }

  @action
  removeOpenHours(dayOfTheWeek) {
    this.changeset.set('openHours', this.openHours.filter(openHour => {
      return openHour.dayOfTheWeek !== dayOfTheWeek
    }));
  }

  _onChangesetInvalid() {
    let message = this.intl.t('errors.changeset_invalid');

    this.notifications.clearAll().warning(message);
    this.isProcessing = false;
  }
}
