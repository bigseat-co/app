export default class Model {
  setProperties(properties = {}) {
    Object.entries(properties).forEach(entry => {
      let [property, value] = entry;

      if (this.hasOwnProperty(property)) {
        this[property] = value;
      }
    });

    return this;
  }

  getProperties(properties = []) {
    return properties.reduce((result, property) => {
      result[property] = this[property];
      return result;
    }, {});
  }
}