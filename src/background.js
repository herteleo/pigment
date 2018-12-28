// eslint-disable-next-line import/no-extraneous-dependencies
import { app, Menu, protocol, BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';

import pkg from '../package.json';

app.setAppUserModelId(process.execPath);

const moduleReq = require('module');

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // Don't load any native (external) modules until the following line is run:
  moduleReq.globalPaths.push(process.env.NODE_MODULES_PATH);
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });
function createMainWindow() {
  const window = new BrowserWindow({
    icon: path.join(__static, 'favicon.ico'), // eslint-disable-line no-undef
    frame: false,
  });

  // remove electron and app specific user agents to prevent sideeffects like
  // https://github.com/ramboxapp/community-edition/issues/1981
  // https://github.com/meetfranz/franz/issues/1185
  // https://github.com/meetfranz/franz/issues/1138
  const removeUserAgents = `(Electron|${pkg.name})/([0-9.]+) `;
  window.webContents.setUserAgent(window.webContents.getUserAgent().replace(new RegExp(removeUserAgents, 'g'), ''));

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) window.webContents.openDevTools();
  } else {
    createProtocol('app');
    //   Load the index.html when not in development
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  mainWindow = createMainWindow();

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click() { app.quit(); } },
      ],
    }, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
      ],
    },
  ]));
});
