import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

class SignupRequest {
  email
  firstName
  lastName
  organizationName
  password
  termsAcceptance = false
}

export default class SignupRoute extends Route {
  model() {
    return new SignupRequest();
  }
}
