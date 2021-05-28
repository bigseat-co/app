import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import RemovePerson from 'bigseat/gql/mutations/remove-person.graphql';
import ListPeople from 'bigseat/gql/queries/list-people.graphql';
import { sortByProperty } from 'bigseat/helpers/sort-by-property';

export default class AdminPeopleIndexController extends Controller {
  @tracked isDeleting = false
  @service apollo
  @service notifications
  @service intl

  get people() {
    let members = this.model.filter(person => !person.isAdmin);

    return sortByProperty(members, 'firstName');
  }

  getFullName(person) {
    let { firstName, lastName } = person;

    return capitalize(firstName) + ' ' + capitalize(lastName);
  }

  @action
  async delete(person) {
    let fullName = this.getFullName(person);

    this.isDeleting = true;

    if (!window.confirm(`Delete ${fullName}?`)) {
      this.isDeleting = false;
      return;
    }

    try {
      await this._delete(person);
    } catch(error) {
      console.log(error);
      this._onDeleteError(person, error);
      return;
    }

    this.isDeleting = false;
    this.notifications.clearAll().success(this.intl.t('admin.people.person_deleted'));
  }

  async _delete(person) {
    let { id } = person;

    return this.apollo.mutate({
      mutation: RemovePerson,
      variables: {
        id: id
      },
      update: (cache) => {
        cache.evict({ id: `DashboardPerson:${id}`});
      },
    });
  }

  _onDeleteError(person, error) {
    let fullName = this.getFullName(person);

    this.notifications.clearAll().error(`Unable to delete ${fullName}`);
    this.isDeleting = false;
  }
}
