import { contextBridge, ipcRenderer, shell } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Add a `window.api` object inside the renderer process with the `openUrl`
// function.
contextBridge.exposeInMainWorld('api', {
  // Open an URL into the default web-browser.
  openUrl: (url: string) => shell.openExternal(url)
});
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

const apis = {
  os,
  path,
  ipcRenderer: withPrototype(ipcRenderer) as typeof ipcRenderer,
  // 由于statSync中isDirectory和isFile方法无法传递，所以在render中不可使用fsExtra.statSync
  fs: fs as Omit<typeof fs, 'statSync'>,
  shell: shell
};

export type ElectronApi = typeof apis;

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('electron', {
  ...apis
});
