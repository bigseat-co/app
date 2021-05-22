import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import CreateSpaceMutation from 'bigseat/gql/mutations/create-space.graphql';
import listSpaces from 'bigseat/gql/queries/list-spaces.graphql'; // TODO - Should be called ListSpaces

export default class AdminSpacesNewController extends Controller {
  @tracked isProcessing = false

  @service apollo
  @service notifications
  @service intl

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
    let { spaceForm } = this.model;

    debugger;

    return this.apollo.mutate({
      mutation: CreateSpaceMutation,
      variables: {
        name: spaceForm.name,
        maximumPeople: parseInt(spaceForm.maximumPeople),
        dailyCheckin: false,
        openHours: spaceForm.openHours.map(openHour => {
          return {
            dayOfTheWeek: openHour.dayOfTheWeek,
            openTime: this._formatTime(openHour.openTime),
            closeTime: this._formatTime(openHour.closeTime)
          }
        })
      },
      refetchQueries: [{ query: listSpaces }],
      awaitRefetchQueries: true
    });
  }

  _formatTime(time) {
    return `${time}:00Z`;
  }

  _onChangesetInvalid() {
    let message = 'Some of the informations you entered are incorrect';

    this.notifications.clearAll().warning(message);
    this.isProcessing = false;
  }

  _onCreateError(error) {
    console.log(error);
    let message = this.intl.t('errors.generic');

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }
}
