export default class SpaceForm {
  name
  maximumPeople

  setProperties(properties) {
    Object.entries(properties).forEach(entry => {
      let [property, value] = entry;

      if (this.hasOwnProperty(property)) {
        this[property] = value;
      }
    });

    return this;
  }
}

