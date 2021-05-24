import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import CreateSpaceMutation from 'bigseat/gql/mutations/create-space.graphql';
import listSpaces from 'bigseat/gql/queries/list-spaces.graphql'; // TODO - Should be called ListSpaces
import Space from 'bigseat/models/space';

export default class AdminSpacesNewController extends Controller {
  @service apollo
  @service notifications
  @service intl

  constructor() {
    super(...arguments);

    this.space = new Space();
  }

  @action
  async create() {
    try {
      await this._create();
    } catch(error) {
      this._onCreateError(error);
      return;
    }

    this.space = new Space(); // Reset

    this.notifications.success(this.intl.t('admin.spaces.space_created'));
    this.transitionToRoute('admin.spaces');
  }

  _create() {
    let space = this.space;

    return this.apollo.mutate({
      mutation: CreateSpaceMutation,
      variables: {
        name: space.name,
        maximumPeople: parseInt(space.maximumPeople),
        dailyCheckin: false,
        openHours: space.openHours.map(openHour => {
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

  _onCreateError(error) {
    console.log(error);
    let message = this.intl.t('errors.generic');

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }
}
