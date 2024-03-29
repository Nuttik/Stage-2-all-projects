import { State } from './state';
import Api from './api';
import GaragePageView from '../pages/garage';
import WinnersPageView from '../pages/winners';
import RaceTable from '../components/race-table.ts/race-table';
import { PaginationButtons } from '../utils/interfaces';
import CarEl from '../components/car/car';

class App {
  state: State;
  race: boolean;
  carsElements: HTMLElement[];
  pageGarage: GaragePageView;
  pageWinners: WinnersPageView;
  raceTable: RaceTable;
  counterGarage: HTMLElement;
  pageNumberGarage: number;
  paginationButtonGarage: PaginationButtons;
  pageNumberWinner: number;
  paginationButtonWinner: PaginationButtons;
  formUpdateCar: HTMLElement;
  formCreateCar: HTMLElement;
  selectedCarId: number;
  selectedCarName: HTMLElement;
  selectedCarSVG: SVGElement;

  constructor() {
    this.state = new State('', '#ffffff', '', '#ffffff', 1, 1);
    this.race = false;
  }

  public async start() {
    this.pageGarage = new GaragePageView(this);
    this.pageWinners = new WinnersPageView(this);
    this.pageGarage.render();
    this.raceTable = new RaceTable();
    this.pageNumberGarage = 1;
    this.pageNumberWinner = 1;
    const carsData = await Api.getCars(1, 7);
    if (carsData.totalCount) {
      this.pageGarage.createCarsCounter(this, parseInt(carsData.totalCount));
    } else {
      this.pageGarage.createCarsCounter(this, carsData.cars.length);
    }
    const raceTable = this.pageGarage.createRaceTable(this, carsData.cars);
    this.pageGarage.mainContent.append(raceTable);
    this.pageGarage.addPaginationButtons(this);
    this.pageGarage.setPaginationButtons(this, carsData);
  }

  public async updateCar(event: Event, id: number) {
    const inputText = this.formUpdateCar.querySelector('.input_text') as HTMLInputElement;
    const inputColor = this.formUpdateCar.querySelector('.input_color') as HTMLInputElement;
    const name = inputText.value;
    const color = inputColor.value;
    this.selectedCarName.innerHTML = name;
    CarEl.changeColor(color, this.selectedCarSVG);
    CarEl.changeName(name, this.selectedCarName);
    await Api.updateCar(id, name, color);
  }
}

export default App;