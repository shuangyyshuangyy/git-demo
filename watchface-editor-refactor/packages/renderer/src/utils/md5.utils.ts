import { ElectronApi } from '@/services/electron.api';
import JSMD5 from 'js-md5';

/**
 * 获取文本的md5
 * @param content 要转为md5的文本
 * @param short [可选] 是否返回8位md5值，默认为false
 * @returns {String} md5值
 */
export const textToMd5 = (content: string, short = false) => {
  const md5 = JSMD5(content);
  return short ? md5?.slice(8, 15) : md5;
};

/**
 * 获取文件的md5
 * @param content 要转为md5的文件名称
 * @param short [可选] 是否返回8位md5值，默认为true
 * @returns {String} md5值
 */
export const fileToMd5 = async (filename: string, short = true) => {
  const fs = ElectronApi.fs;
  const content = await fs?.promises.readFile(filename);
  if (!content) return;
  const md5 = JSMD5(content);
  return short ? md5?.slice(8, 15) : md5;
};
