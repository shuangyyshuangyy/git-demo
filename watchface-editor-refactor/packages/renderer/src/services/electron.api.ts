import { ensureDir } from '@/utils/fs/fs-extra.utils';

export interface AppInfo {
  name?: string;
  isPackaged?: boolean;
  root?: string;
  resourcePath?: string;
  platform?: NodeJS.Platform;
  adb: string;
  version: string;
  versions: {
    chrome: string;
    electron: string;
    node: string;
  };
}

/**
 * 定义和electron交互的方法
 */
export class ElectronApi {
  /**
   * 返回os
   */
  static get os() {
    return window.electron?.os;
  }
  /**
   * 返回fsExtra
   */
  static get fs() {
    return window.electron?.fs;
  }

  /**
   * 返回shell
   */
  static get shell() {
    return window.electron?.shell;
  }

  /**
   * 返回path
   */
  static get path() {
    return window.electron?.path;
  }

  /**
   * 返回ipcRenderer
   */
  static get ipcRenderer() {
    return window.electron?.ipcRenderer;
  }

  static async getApp(): Promise<AppInfo> {
    return (await ElectronApi.ipcRenderer?.invoke('get_app_info')) ?? {};
  }

  /**
   * 打开目录
   * @param dir
   * @returns
   */
  static async showItemInFolder(dir: string) {
    await ElectronApi.shell?.showItemInFolder(dir);
  }

  /**
   * 执行adb或aapt命令
   */
  static async execAdbFile(command: string[]) {
    return await ElectronApi.ipcRenderer?.invoke('exec_adb_file', {
      command
    });
  }

  /**
   * 打开devtools
   */
  static async openDevtools() {
    await ElectronApi.ipcRenderer?.invoke('open_devtools');
  }

  /**
   * 获取临时目录
   */
  static async getPath(pathKey: string) {
    return await ElectronApi.ipcRenderer?.invoke('get_path', { pathKey });
  }

  /**
   * 打开浏览器
   */
  static async openExternalLink(link: string) {
    return await ElectronApi.shell?.openExternal(link);
  }

  /**
   * 返回默认的保存目录
   *
   * @static
   * @memberof ElectornApi
   */
  static async getWatchFaceDir() {
    const dir = ElectronApi.path?.join(
      await ElectronApi.getPath('desktop'),
      'WatchFace'
    );
    if (dir) await ensureDir(dir);
    return dir;
  }

  /**
   * quit
   */
  static async close() {
    await ElectronApi.ipcRenderer?.invoke('close');
  }
}
