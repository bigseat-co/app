import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminPeopleIndexController extends Controller {
  queryParams = ['withRecords']

  withRecords = null;

  get showRecords() {
    return this.withRecords === 'true';
  }

  get people() {
    return this.model.filter(person => !person.isAdmin);
  }
}
