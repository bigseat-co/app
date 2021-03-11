import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

class SigninRequest {
  email
  password
}

export default class SigninRoute extends Route {
  model() {
    return new SigninRequest();
  }
}
