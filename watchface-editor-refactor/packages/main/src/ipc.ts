import { ipcMain, BrowserWindow, app } from 'electron';
import type { OpenDialogOptions } from 'electron';

// 选择文件或文件夹
ipcMain.handle(
  'pick_file',
  async (
    e,
    {
      mode,
      extensions,
      multi
    }: { mode: 'file' | 'dir' | 'all'; extensions?: string[]; multi?: boolean }
  ) => {
    const { dialog } = await import('electron');
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (!mainWindow) return [];

    const properties: OpenDialogOptions['properties'] =
      mode === 'dir'
        ? ['openDirectory']
        : mode === 'file'
        ? ['openFile']
        : ['openFile', 'openDirectory'];
    if (multi) properties.push('multiSelections');
    if (mode !== 'file') properties.push('createDirectory');

    const res = await dialog.showOpenDialog(mainWindow, {
      title:
        mode === 'dir'
          ? '选择目录'
          : mode === 'file'
          ? '选择文件'
          : '选择目录或者文件',
      properties,
      filters: extensions
        ? [{ extensions: [...extensions], name: 'file-filter' }]
        : undefined
    });

    return res.filePaths;
  }
);

// quit
ipcMain.handle('close', async () => {
  BrowserWindow.getFocusedWindow()?.close();
});
