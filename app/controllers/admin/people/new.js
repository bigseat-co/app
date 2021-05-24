import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import AddNewTeamMember from 'bigseat/gql/mutations/add-new-team-member.graphql';
import ListPeople from 'bigseat/gql/queries/list-people.graphql';

export default class AdminPeopleNewController extends Controller {
  @service apollo
  @service notifications
  @service intl

  @action
  async save(people) {
   let addPeople = people.map(async person => {
      try {
        await this._save(person);
        person.isPersisted = true;
      } catch(error) {
        this._onSaveError(person, error);
      }
    });

    await Promise.all(addPeople);

    let everyPeoplePersisted = people.every(person => person.isPersisted);

    if (!everyPeoplePersisted) {
      this.notifications.clearAll().warning(this.intl.t('errors.unable_to_save_all_people'));
      return;
    }

    this.notifications.clearAll().success(this.intl.t('admin.people.people_added'));
    this.transitionToRoute('admin.people');
  }

  _save(person) {
    return this.apollo.mutate({
      mutation: AddNewTeamMember,
      variables: {
        email: person.email,
        firstName: person.firstName,
        lastName: person.lastName,
        group: person.group,
        origin: 'native'
       },
      refetchQueries: [{ query: ListPeople }],
      awaitRefetchQueries: true
    });
  }

  _onSaveError(person, error) {
    let errors = error.errors.map(error => error.message);
    let message = errors.includes('email has already been taken')
                  ? this.intl.t('errors.email_taken')
                  : this.intl.t('errors.unable_to_save_person');

    person.isPersisted = false;
    person.persistenceError = message;
  }
}