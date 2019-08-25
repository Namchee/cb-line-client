import {
  ButtonsMessage,
  ActionButton,
  generateActionButton,
} from './src/service/line/messages';

const actionButtons: ActionButton[] = [];

actionButtons.push(generateActionButton('label', 'test'));

const test: ButtonsMessage = new ButtonsMessage({
  actions: actionButtons,
});

