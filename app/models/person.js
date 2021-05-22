import Model from 'bigseat/models/model';
import { guidFor } from '@ember/object/internals';

export default class Person extends Model {
  key = guidFor(this)

  email
  firstName
  lastName
  group = 'office'

  isPersisted = false
  persistenceError
}