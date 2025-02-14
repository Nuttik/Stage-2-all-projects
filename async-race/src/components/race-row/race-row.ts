import Button from '../button/button';
import CarEl from '../car/car';
import App from '../../app/app';
import Api from '../../app/api';
import './race-row.scss';
import { SpeedCar } from '../../utils/interfaces';
import Elem from '../element/element';

class RaceRow {
  static create(id: number, name: string, color: string, app: App): HTMLElement {
    const row = Elem.create('div', ['race-row']);
    row.id = String(id);
    const top = Elem.create('div', ['race-row__top-row']);
    const topButtons = Elem.create('div', ['race-row__top-buttons']);

    const carName = Elem.create('div', ['race-row__car-name'], name);

    const track = Elem.create('div', ['race-row__track']);

    const car = CarEl.create(color);

    const controlButtons = Elem.create('div', ['race-row__control-buttons']);
    const buttonB: HTMLButtonElement = Button.create(
      'B',
      ['race-row__button', 'button_reset', 'button_cars-control'],
      () => {}
    );

    const buttonA = Button.create('A', ['race-row__button', 'button_start', 'button_cars-control'], async () => {
      buttonA.disabled = true;
      let interval: ReturnType<typeof setInterval>;
      try {
        const startResponse = (await Api.startOrStopCar(id, 'started')) as SpeedCar;
        const isMoving: boolean = true;
        interval = app.startCarAnimation(car, startResponse.distance / startResponse.velocity / 10, isMoving);
        await Api.switchCarToDriveMode(id, app.abortController);
        buttonB.disabled = false;
      } catch (error) {
        clearInterval(interval);
        buttonB.disabled = false;
      }
    });

    buttonB.addEventListener('click', () => {
      app.stopCar(id, buttonA, buttonB, car);
    });
    buttonB.disabled = true;

    const buttonSelect = Button.create(
      'Select',
      ['race-row__button', 'button_select', 'button_small', 'button_blue'],
      this.buttonSelectOnClick.bind(this, this, app, id, carName, car)
    );
    const buttonRemove = Button.create(
      'Remove',
      ['race-row__button', 'button_remove', 'button_small', 'button_blue'],
      async () => {
        await Api.deleteCar(id);
        try {
          const winnerData = await Api.getWinner(id);
          if (winnerData) {
            Api.deleteWinner(id);
          }
        } catch {
          console.log('delete car');
        }

        const carsData = await Api.getCars(app.pageNumberGarage, 7);
        app.raceTable.table.remove();
        app.raceTable.table = app.pageGarage.createRaceTable(app, carsData.cars);
        app.pageNumberGarageElem.after(app.raceTable.table);
        app.pageGarage.setCarsCounter(app, Number(carsData.totalCount));
        app.pageGarage.setPaginationButtons(app, carsData);
        if (app.raceTable.rows.length === 0) {
          app.pageGarage.creatPrevPage(app);
        }
      }
    );

    topButtons.append(buttonSelect);
    topButtons.append(buttonRemove);
    top.append(topButtons);

    top.append(carName);
    controlButtons.append(buttonA);
    controlButtons.append(buttonB);
    track.append(controlButtons);
    track.append(car);
    row.append(top);
    row.append(track);

    return row;
  }

  static async buttonSelectOnClick(
    buttonSelect: HTMLButtonElement,
    app: App,
    id: number,
    nameEl: HTMLElement,
    svg: SVGElement
  ) {
    app.formUpdateCar.querySelector('button').disabled = false;
    const inputText = app.formUpdateCar.querySelector('.input_text') as HTMLInputElement;
    const inputColor = app.formUpdateCar.querySelector('.input_color') as HTMLInputElement;
    const button = app.formUpdateCar.querySelector('button') as HTMLButtonElement;
    inputText.focus();
    const carData = await Api.getCar(id);
    inputText.value = carData.name;
    inputColor.value = carData.color;
    app.selectedCarId = id;
    app.selectedCarName = nameEl;
    app.selectedCarSVG = svg;
    buttonSelect.disabled = true;
    const buttons = app.raceTable.table.querySelectorAll('.button');
    buttons.forEach((elem: HTMLButtonElement) => (elem.disabled = true));

    //отменяем выделение машины
    document.body.addEventListener('click', function onClick(event: Event) {
      const target = event.target as HTMLElement;
      if (!target.closest('.form_update-car') || event.target === button) {
        buttons.forEach((elem: HTMLButtonElement) => {
          if (!elem.classList.contains('button_reset')) {
            elem.disabled = false;
          }
        });
        button.disabled = true;
        buttonSelect.disabled = false;
        inputText.value = '';
        inputColor.value = '#ffffff';
        document.body.removeEventListener('click', onClick);
        app.selectedCarId = null;
      }
    });
  }
}

export default RaceRow;
