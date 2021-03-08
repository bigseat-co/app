import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import SignupMutation from '../gql/mutations/signup.graphql';
import SignupRequestValidation from '../validations/signup-request';

class SignupRequest {
  @tracked email
  @tracked firstName
  @tracked lastName
  @tracked organizationName
  @tracked password
  @tracked termsAcceptance = false
}

const ERRORS = {
  default: `
    Something went wrong and we are not totally sure why.
    We are here to help: support@bigseat.co
  `
};

export default class SignupController extends Controller {
  @service apollo
  @service auth
  @service cookies
  @service notifications

  SignupRequestValidation = SignupRequestValidation
  signupRequest = new SignupRequest()

  errors = ERRORS

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

    // TODO - I'm still blury on how to handle properly promises.
    return this.createRecord()
      .then((response) => {
        // TODO - What happen if signup.apiKey does not exist? Should we handle that?
        this.cookies.write('token', response.signup.apiKey)
        this.auth.signIn(); // TODO - Need to implement with real token
        this.transitionToRoute('admin');
      })
      .catch((response) => {
        let message = response.errors?.firstObject?.message || this.errors.default;

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
