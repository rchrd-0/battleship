import './style.css';
import * as game from './modules/game'
import * as dom from './modules/dom';
import * as eventController from './modules/event-controller'

dom.createBoards();
game.startGame();
eventController.initBoardEvents();