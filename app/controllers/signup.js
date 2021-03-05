import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
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

export default class SignupController extends Controller {
  @service apollo

  SignupRequestValidation = SignupRequestValidation
  signupRequest = new SignupRequest()

  isCreatingRecord = false

  @action
  async signup(changeset, other, yolo) {
    await changeset.validate();

    if (changeset.isInvalid) {
      return;
    }

    await changeset.save();

    if (this.isCreatingRecord) {
      return;
    }

    this.isCreatingRecord = true;

    this.createRecord()
      .then((response) => {
        alert('Welcome to bigseat');
        //this.auth.signIn();
        //this.transitionToRoute('admin');
      })
      .catch(() => {
        alert('Unable to signup');
      })
      .finally(() => {
        this.isCreatingRecord = false
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
      organization: { name: attrs.organizationName },
      password: attrs.password
    }
  }
}
