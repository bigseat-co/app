import Model from 'bigseat/models/model';

export default class SpaceForm extends Model {
  name
  maximumPeople
  openHours

  isOpen(dayOfTheWeek) {
    let openHour = this.openHours.find(openHour => openHour.dayOfTheWeek === dayOfTheWeek);

    return openHour.openTime == openHour.closeTime
  }
}

