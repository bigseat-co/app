import LinkComponent from '@ember/routing/link-component';

export function initialize(/* application */) {
  LinkComponent.reopen({
    activeClass: 'is-active'
  });
}

export default {
  initialize
};
