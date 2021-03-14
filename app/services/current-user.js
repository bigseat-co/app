import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;

  load() {
    if (!this.session.isAuthenticated) {
      return;
    }

    let { __typename, ...user } = this.session.data.authenticated.signin;

    this.set('user', user);
  }
}