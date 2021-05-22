import Model from 'bigseat/models/model';

export default class SignupRequest extends Model {
  email
  firstName
  lastName
  organizationName
  password
  termsAcceptance = false
}