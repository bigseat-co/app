import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class NotificationsComponent extends Component {
  @service notifications

  @action
  showExamples() {
    this.notifications.error('Unable to connect');
    this.notifications.success('Welcome to BigSeat');
    this.notifications.info('A maintenance is scheduled in 10 minutes');
    this.notifications.warning('Your password is too weak');
  }
}