import Form from 'bigseat/models/form';

export default class SignupForm extends Form {
  email
  firstName
  lastName
  organizationName
  password
  termsAcceptance = false
}
