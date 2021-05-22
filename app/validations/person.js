import {
  validateExclusion,
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validateFormat({ type: 'email' })
  ],
  firstName: [
    validatePresence(true)
  ],
  lastName: [
    validatePresence(true)
  ],
  group: [
    validatePresence(true)
   // also validate incluse office / remote
  ]
};
