import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class AuthService extends Service {
  @service cookies;

  isSignedIn() {
    return this.cookies.read('signedIn') === 'true';
  }

  signIn() {
    this.cookies.write('signedIn', true);
  }

  signOut() {
    this.cookies.write('signedIn', false);
  }
}
