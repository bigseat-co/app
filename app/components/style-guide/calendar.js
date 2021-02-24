import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class CalendarComponent extends Component {
  today = new Date()
}