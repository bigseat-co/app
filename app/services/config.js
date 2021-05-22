import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class Config extends Service {
  get termsOfServiceUrl() {
    return 'https://bigseat.co/terms';
  }

  get privacyPolicyUrl() {
    return 'https://bigseat.co/privacy-policy';
  }
}