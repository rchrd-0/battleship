import './style.css';
import * as game from './modules/game'
import * as dom from './modules/dom';
import * as eventController from './modules/eventController'

dom.createBoards();
game.newGame();

eventController.initBoardEvents();
eventController.initGameButtons();
eventController.initShipPlacement();