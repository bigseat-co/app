import {
  validateExclusion,
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  firstName: [
    validatePresence(true),
  ],
  lastName: [
    validatePresence(true)
  ],
  email: [
    validateFormat({ type: 'email' })
  ],
  password: [
    validateLength({ min: 8 })
  ],
  organizationName: [
    validatePresence(true)
  ],
  termsAcceptance: [
    validateExclusion({
      list: [false],
      message: 'Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy'
    })
  ]
};