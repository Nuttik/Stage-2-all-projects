import Api from './app/api';

const api = new Api('http://127.0.0.1:3000');
//api.createCar('ford nata', '#000000').then((result) => console.log(result));
api.getCars().then((result) => console.log(result));

api
  .updateWinner(1, 2, 4.2)
  .then(() => api.getWinners())
  .then((result) => console.log(result));
//  .startOrStopCar(2, 'started')
//  .then((result) => console.log(result))
//  .then(() => api.startOrStopCar(2, 'stopped'))
//  .then((result) => console.log(result));