import Model from 'bigseat/models/model';

export default class Space extends Model {
  name
  maximumPeople
  openHours = [
    { dayOfTheWeek: 'monday', openTime: '08:00', closeTime: '17:00' },
    { dayOfTheWeek: 'tuesday', openTime: '08:00', closeTime: '17:00' },
    { dayOfTheWeek: 'wednesday', openTime: '08:00', closeTime: '17:00' },
    { dayOfTheWeek: 'thursday', openTime: '08:00', closeTime: '17:00' },
    { dayOfTheWeek: 'friday', openTime: '08:00', closeTime: '17:00' }
  ]
}

