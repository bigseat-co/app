import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { w } from '@ember/string';
import { inject as service } from '@ember/service';
import SpaceFormValidation from '../../../validations/space-form';
import EditSpaceMutation from '../../../gql/mutations/edit-space.graphql';
import listSpaces from '../../../gql/queries/list-spaces.graphql'; // TODO - Should be named ListSpaces

export default class AdminSpacesEditController extends Controller {
  SpaceFormValidation = SpaceFormValidation
  isProcessing = false

  @service apollo
  @service notifications
  @service intl

  @action
  async update(changeset) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await changeset.validate();

    if (changeset.isInvalid) {
      this._onchangesetInvalid();
      return;
    }

    await changeset.save();

    try {
      await this._update();
    } catch(error) {
      this._onUpdateError(error);
      return;
    }

    this.isProcessing = false;
    this.transitionToRoute('admin.spaces');
  }

  _update() {
    return this.apollo.mutate({
      mutation: EditSpaceMutation,
      variables: {
        id: this.model.space.id,
        spaceInput: {
          name: this.model.spaceForm.name,
          maximumPeople: parseInt(this.model.spaceForm.maximumPeople),
          dailyCheckin: false
        }
      },
      refetchQueries: [{ query: listSpaces }],
      awaitRefetchQueries: true
    });
  }

  _onChangesetInvalid() {
    let message = 'Some of the informations you entered are incorrect';

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }

  _onUpdateError(error) {
    console.error(error.errors);
    let message = this.intl.t('errors.generic');

    this.notifications.clearAll().error(message);
    this.isProcessing = false;
  }
}
