import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import signup from "../gql/mutations/signup.graphql";


export default class SignupController extends Controller {
  @service apollo;
  @service notifications;

  isProcessing = false
  isShowingTerms = false
  isShowingPrivacy = false

  @action
  submitForm() {
    let variables = {
      email: "jeremie@bigseee.co",
      firstName: "Jeremie",
      lastName: "Ges",
      organization: {
        name: "trthrergeergthr"
      },
      password: "bigseatftw"
    };

    this.toggleProperty('isProcessing');

    this.apollo
      .mutate({
        mutation: signup,
        variables
      })
      .then(() => {
        this.notifications.success('Welcome to bigseat!');
      })
      .catch(() => {
        this.notifications.error('Oops, something went wrong');
      })
      .finally(() => {
        this.toggleProperty('isProcessing');
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
