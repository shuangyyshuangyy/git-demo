import { join } from 'node:path';
import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import { platform } from 'os';
import './ipc';
// import { listenOnClose } from './save';

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

// 屏蔽安全warning
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const getMenu = () => {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'Electron',
      submenu: [
        {
          role: 'help',
          label: '当前版本：' + app.getVersion()
        }
      ]
    })
  );
  menu.append(
    new MenuItem({
      label: 'Edit',
      submenu: [
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        // { role: 'redo' },
        // { role: 'undo' },
        { role: 'cut' }
      ]
    })
  );
  menu.append(
    new MenuItem({
      label: 'View',
      submenu: [{ role: 'toggleDevTools' }]
    })
  );
  return menu;
};
if (platform() === 'win32' && app.isPackaged) {
  // 在windows上屏蔽自带菜单
  Menu.setApplicationMenu(null);
} else {
  Menu.setApplicationMenu(getMenu());
}

async function createWindow(route = '') {
  const browserWindow = new BrowserWindow({
    show: false,
    width: 1350,
    height: 768,
    minWidth: 1350,
    titleBarStyle:
      platform() == 'win32'
        ? app.isPackaged
          ? 'hidden'
          : 'hiddenInset'
        : 'hiddenInset',
    webPreferences: {
      webviewTag: false,
      // Electron current directory will be at `dist/main`, we need to include
      // the preload script from this relative path: `../preload/index.cjs`.
      preload: join(__dirname, '../preload/index.cjs'),
      nodeIntegration: true
    }
  });

  // 打开开发工具
  if (!app.isPackaged) {
    browserWindow.webContents.openDevTools({ mode: 'bottom' });
  }

  // If you install `show: true` then it can cause issues when trying to close the window.
  // Use `show: false` and listener events `ready-to-show` to fix these issues.
  // https://github.com/electron/electron/issues/25012
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
  });

  // Define the URL to use for the `BrowserWindow`, depending on the DEV env.
  const pageUrl = import.meta.env.DEV
    ? 'http://localhost:5173' + `#/${route}`
    : 'https://cnbj1-fds.api.xiaomi.net/watchface-editor-renderer/index.html';

  await browserWindow.loadURL(pageUrl);

  // 当关闭时，发生关闭事件到renderer，然后在判断关闭
  // if (app.isPackaged) listenOnClose(browserWindow);

  return browserWindow;
}

app.on('second-instance', () => {
  createWindow().catch((err) =>
    console.error(
      'Error while trying to prevent second-instance Electron event:',
      err
    )
  );
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)
    createWindow().catch((err) =>
      console.error(
        'Error while trying to handle activate Electron event:',
        err
      )
    );
});

app
  .whenReady()
  .then(() => createWindow())
  .catch((e) => console.error('Failed to create window:', e));
