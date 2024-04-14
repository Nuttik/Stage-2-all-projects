import App from '../../app/app';
import Button from '../button/button';
import WebSocketAPI from '../../api/api';
import { createLogotype } from '../logotype/logotype';
import './header.scss';
import User from '../../app/user';

export class Header {
  static create(app: App): HTMLElement {
    const header = document.createElement('header');
    header.className = 'header';
    const logotype = createLogotype();

    const leftRow = document.createElement('header');
    leftRow.className = 'header__left';

    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'header__button-row';

    const buttonAbout = Button.create('About Us', ['button_about'], () => {
      app.router.urlRoute(app, app.router.urlPath.ABOUT);
    });
    app.appHtmlEllements.buttonAbout = buttonAbout;

    const buttonLogout = Button.create('Logout', ['button_logout'], () => {
      WebSocketAPI.sendUserLogout(app, app.webSocket, app.user.login, app.user.password);
    });
    app.appHtmlEllements.buttonLogout = buttonLogout;

    const user = document.createElement('div');
    user.className = 'header__user';
    user.innerHTML = `Hello, ${app.user.login}!`;

    buttonsRow.append(buttonAbout);
    buttonsRow.append(buttonLogout);
    leftRow.append(logotype);
    leftRow.append(user);
    header.append(leftRow);
    header.append(buttonsRow);
    return header;
  }
}
