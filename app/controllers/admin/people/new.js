import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AdminPeopleNewController extends Controller {
  @action
  save(people) {
    alert('save');
  }
}
