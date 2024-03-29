import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class SidebarComponent extends Component {
  @service session
  @service currentUser

  @action
  signout() {
    this.session.invalidate();
  }
}