import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, computed } from "@ember/object";
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import SignupMutation from "../../gql/mutations/signup.graphql";

export default class SignupFormComponent extends Component {
  @service apollo;
  @service notifications;

  @tracked email;
  @tracked firstName;
  @tracked lastName;
  @tracked organizationName;
  @tracked password;

  @tracked isProcessing = false;
  @tracked isShowingTerms = false;
  @tracked isShowingPrivacy = false;

  get signupValues() {
    return [
      this.email,
      this.firstName,
      this.lastName,
      this.organizationName,
      this.password
    ];
  }

  get signupValuesPresent() {
    return this.signupValues.every(value => !isEmpty(value))
  }

  get isSignupValid() {
    return this.signupValuesPresent;
  }

  performSignup() {
    return this.apollo.mutate({ mutation: SignupMutation,
      variables: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        organization: {
          name: this.organizationName
        },
        password: this.password
      }
    });
  }

  @action
  submit() {
    if (!this.isSignupValid) {
      return this.notifications.clearAll().error('The form is invalid');
    }

    this.isProcessing = true;

    this.performSignup()
      .then((response) => {
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
