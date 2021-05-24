import { helper } from '@ember/component/helper';

function pluralize([count, singular, plural]) {
  return count === 1 ? singular : plural;
}

export default helper(pluralize);