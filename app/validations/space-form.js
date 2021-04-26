import {
  validateExclusion,
  validateFormat,
  validateLength,
  validateNumber,
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence(true)
  ],
  maximumPeople: [
    validatePresence(true),
    validateNumber()
  ]
};