import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { sortByProperty } from 'bigseat/helpers/sort-by-property';
import RemoveSpace from 'bigseat/gql/mutations/remove-space.graphql';

export default class AdminSpacesIndexController extends Controller {
  @tracked isDeleting = false
  @service apollo
  @service notifications
  @service intl

  get spaces() {
    return sortByProperty(this.model, 'name');
  }

  @action
  async delete(space) {
    this.isDeleting = true;

    if (!window.confirm(`Delete ${space.name}?`)) {
      this.isDeleting = false;
      return;
    }

    try {
      await this._delete(space);
    } catch(error) {
      console.log(error);
      this._onDeleteError(space, error);
      return;
    }

    this.isDeleting = false;
    this.notifications.clearAll().success(this.intl.t('admin.spaces.space_deleted'));
  }

  async _delete(space) {
    let { id } = space;

    return this.apollo.mutate({
      mutation: RemoveSpace,
      variables: {
        id: id
      },
      update: (cache) => {
        cache.evict({ id: `DashboardSpace:${id}`});
      },
    });
  }

  _onDeleteError(space, error) {
    this.notifications.clearAll().error(`Unable to delete ${space.name}`);
    this.isDeleting = false;
  }
}
