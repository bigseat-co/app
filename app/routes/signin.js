import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import SigninForm from 'bigseat/models/signin-form';

export default class SigninRoute extends Route {
  model() {
    return {
      signinForm: new SigninForm()
    };
  }
}
