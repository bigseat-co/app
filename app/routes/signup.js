import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import SignupForm from 'bigseat/models/signup-form';

export default class SignupRoute extends Route {
  model() {
    return {
      signupForm: new SignupForm()
    };
  }
}
