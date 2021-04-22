import {
  validateExclusion,
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence(true)
  ]
};