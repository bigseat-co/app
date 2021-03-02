import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, computed } from "@ember/object";
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import signup from "../../gql/mutations/signup.graphql";

export default class SignupFormComponent extends Component {
  @service apollo;
  @service notifications;

  @tracked signup = {
    email: null,
    firstName: null,
    lastName: null,
    company: null,
    password: null
  };

  @tracked isProcessing = false;
  @tracked isShowingTerms = false;
  @tracked isShowingPrivacy = false;

  get isValidSignup() {
    let fields = Object.values(this.signup);

    return fields.every((field) => !isEmpty(field));
  }

  get variables() {
    return {
      email: this.signup.email,
      firstName: this.signup.firstName,
      lastName: this.signup.lastName,
      organization: {
        name: this.signup.company
      },
      password: this.signup.password
    }
  }

  @action
  submit() {
    if (!this.isValidSignup) {
      return this.notifications.clearAll().error('The form is invalid');
    }

    this.isProcessing = true;

    this.apollo
      .mutate({
        mutation: signup,
        variables: this.variables
      })
      .then(() => {
        this.notifications.clearAll().success('Welcome to bigseat!');
      })
      .catch(() => {
        this.notifications.clearAll().error('Oops, something went wrong');
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  @action
  toggleTerms() {
    this.toggleProperty('isShowingTerms');
  }

  @action
  togglePrivacy() {
    this.toggleProperty('isShowingPrivacy');
  }
}
