import Model from 'bigseat/models/model';

export default class SignupForm extends Model {
  email
  firstName
  lastName
  organizationName
  password
  termsAcceptance = false
}
