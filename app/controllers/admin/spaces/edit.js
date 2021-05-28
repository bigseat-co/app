import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import EditSpaceMutation from 'bigseat/gql/mutations/edit-space.graphql';
import ListSpaces from 'bigseat/gql/queries/list-spaces.graphql';

export default class AdminSpacesEditController extends Controller {
  space

  @service apollo
  @service notifications
  @service intl

  @action
  async update() {
    try {
      await this._update();
    } catch(error) {
      this._onUpdateError(error);
      return;
    }

    this.notifications.success(this.intl.t('admin.spaces.space_updated'));
    this.transitionToRoute('admin.spaces');
  }

  _update() {
    return this.apollo.mutate({
      mutation: EditSpaceMutation,
      variables: {
        id: this.model.space.id,
        spaceInput: {
          name: this.space.name,
          maximumPeople: parseInt(this.space.maximumPeople),
          dailyCheckin: false,
          openHours: this.space.openHours.map(openHour => {
            return {
              dayOfTheWeek: openHour.dayOfTheWeek,
              openTime: this._markTimeAsUTC(openHour.openTime),
              closeTime: this._markTimeAsUTC(openHour.closeTime)
            }
          })
        }
      },
      refetchQueries: [{ query: ListSpaces }],
      awaitRefetchQueries: true
    });
  }

  _onChangesetInvalid() {
    let message = 'Some of the informations you entered are incorrect';

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }

  _onUpdateError(error) {
    console.error(error.errors);
    let message = this.intl.t('errors.generic');

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }

  // 17:00 => 17:00:00z
  _markTimeAsUTC(time) {
    return `${time}:00Z`;
  }
}
