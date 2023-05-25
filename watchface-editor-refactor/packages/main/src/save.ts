import { BrowserWindow, ipcMain } from 'electron';

let testCanClose = false;

export const listenOnClose = (win: BrowserWindow) => {
  testCanClose = false;
  win.on('close', (e) => {
    if (!testCanClose) {
      e.preventDefault(); //阻止默认行为，一定要有
      win.webContents.postMessage('test-can-close', 'test-can-close');
    }
  });
};

// quit
ipcMain.handle('set-can-close', async () => {
  testCanClose = true;
});
