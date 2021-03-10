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
  @service intl
  @service notifications
  @service session

  signinError
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

    try {
      await this.session.authenticate('authenticator:bigseat', {
        email: this.signinRequest.email,
        password: this.signinRequest.password
      });
    } catch(error) {
      this.signinError = error;
    }

    // TODO - This is horrible.
    if (!this.session.isAuthenticated) {
      let message = this.signinError.errors?.firstObject?.message || this.intl.t('errors.generic');
      this.notifications.clearAll().error(message);
      this.isProcessing = false;
      return;
    }

    this.isProcessing = false;
    this.transitionToRoute('admin');
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
