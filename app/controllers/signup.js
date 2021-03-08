import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import SignupMutation from '../gql/mutations/signup.graphql';
import SignupRequestValidation from '../validations/signup-request';

class SignupRequest {
  email
  firstName
  lastName
  organizationName
  password
  termsAcceptance = false
}

export default class SignupController extends Controller {
  @service apollo
  @service auth
  @service cookies
  @service intl
  @service notifications

  signupRequest = new SignupRequest()
  SignupRequestValidation = SignupRequestValidation

  @tracked isProcessing = false

  @action
  async signup(changeset) {
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
        this.cookies.write('token', response.signup.apiKey)
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
      mutation: SignupMutation,
      variables: this.serialize(this.signupRequest)
    });
  }

  serialize(attrs) {
    return {
      email: attrs.email,
      firstName: attrs.firstName,
      lastName: attrs.lastName,
      organization: {
        name: attrs.organizationName
      },
      password: attrs.password
    }
  }
}
