import { fillBody } from "./js/fill-body.js";
import { startGame } from "./js/start-game.js";
import { chooseTask } from "./js/choose-task.js";

const startTask = chooseTask("random");

fillBody();
startGame(startTask);