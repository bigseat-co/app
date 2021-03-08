import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import SigninMutation from '../gql/mutations/signin.graphql';
import SigninRequestValidation from '../validations/signin-request';

class SigninRequest {
  email
  password
}

export default class SigninController extends Controller {
  @service apollo
  @service auth
  @service cookies
  @service intl
  @service notifications

  signinRequest = new SigninRequest()
  SigninRequestValidation = SigninRequestValidation

  @tracked isProcessing = false

  @action
  async signin(changeset) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await changeset.validate();

    if (changeset.isInvalid) {
      this.isProcessing = false;
      return;
    }

    await changeset.save();

    return this.createRecord()
      .then((response) => {
        console.log(response);
        this.cookies.write('token', response.signin.apiKey)
        this.auth.signIn(); // TODO - Need to implement with real token
        this.transitionToRoute('admin');
      })
      // TODO - This is wrong, we are not only catching the apollo errors but
      // everything processed in the THEN. Need a fix.
      .catch((response) => {
        let message = response.errors?.firstObject?.message || this.intl.t('errors.generic');

        this.notifications.clearAll().error(message);
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  createRecord() {
    return this.apollo.mutate({
      mutation: SigninMutation,
      variables: this.serialize(this.signinRequest)
    });
  }

  serialize(attrs) {
    return {
      email: attrs.email,
      password: attrs.password
    }
  }
}
