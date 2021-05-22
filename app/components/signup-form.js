import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import SignupRequest from 'bigseat/models/signup-request';
import SignupRequestValidations from 'bigseat/validations/signup-request';
import lookupValidator from 'ember-changeset-validations';
import { isPresent } from '@ember/utils';

export default class SignupForm extends Component {
  @tracked isProcessing
  @service config

  constructor() {
    super(...arguments);

    this.changeset = new Changeset(new SignupRequest(), lookupValidator(SignupRequestValidations), SignupRequestValidations);
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
