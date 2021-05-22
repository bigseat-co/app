import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Person from 'bigseat/models/person';
import PersonValidations from 'bigseat/validations/person';
import lookupValidator from 'ember-changeset-validations';
import { Changeset } from 'ember-changeset';

export default class PeopleForm extends Component {
  @tracked isProcessing = false
  @tracked people

  constructor() {
    super(...arguments);

    this.people = [this._buildPerson()];
  }

  _buildPerson() {
    let person = new Person();

    return new Changeset(person, lookupValidator(PersonValidations), PersonValidations, { skipValidate: true });
  }

  async validatePeople() {
    let validatePeople = this.people.map(async (person) => await person.validate());

    return Promise.all(validatePeople);
  }

  async arePeopleValid() {
    await this.validatePeople();

    return this.people.every(person => person.get('isValid'));
  }

  @action
  setGroup(person, event) {
    person.group = event.target.value;
  }

  @action
  addPerson() {
    let person = this._buildPerson();

    this.people = [...this.people, person];
  }

  @action
  removePerson(index) {
    this.people = this.people.filter((_person, personIndex) => personIndex !== index);
  }

  @action
  async submit() {
    this.isProcessing = true;
    let arePeopleValid = await this.arePeopleValid();

    if (!arePeopleValid) {
      this.isProcessing = false;
      return;
    }

    await this.args.onSubmit(this.people);

    this.isProcessing = false;
  }
}