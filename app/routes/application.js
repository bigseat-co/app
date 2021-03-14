import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service currentUser
  @service session
  @service intl

  beforeModel() {
    this.intl.setLocale(['en-us']);
    return this._loadCurrentUser();
  }

  async _loadCurrentUser() {
    try {
      await this.currentUser.load();
    } catch(error) {
      await this.session.invalidate();
    }
  }
}