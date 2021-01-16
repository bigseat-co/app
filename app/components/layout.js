import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class LayoutComponent extends Component {
  get isAdminLayout() {
    return this.args.type === 'admin';
  }

  get isBookingLayout() {
    return this.args.type === 'booking';
  }
}