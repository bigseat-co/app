import Controller from '@ember/controller';
import { action } from '@ember/object';
import { sortByProperty } from 'bigseat/helpers/sort-by-property';

export default class AdminSpacesIndexController extends Controller {
  get spaces() {
    return sortByProperty(this.model, 'name');
  }
}
