import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import SigninRequest from 'bigseat/models/signin-request';
import SigninRequestValidations from 'bigseat/validations/signin-request';
import lookupValidator from 'ember-changeset-validations';

export default class SigninForm extends Component {
  @tracked isProcessing

  constructor() {
    super(...arguments);

    this.changeset = new Changeset(new SigninRequest(), lookupValidator(SigninRequestValidations), SigninRequestValidations);
  }

  @action
  async submit() {
    this.isProcessing = true;

    await this.changeset.validate()

    if (this.changeset.isInvalid) {
      this.isProcessing = false;
      return;
    }

    await this.changeset.save();
    await this.args.onSubmit(this.changeset);

    this.isProcessing = false;
  }
}
