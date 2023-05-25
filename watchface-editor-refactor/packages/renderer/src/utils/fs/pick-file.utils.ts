import { ElectronApi } from '@/services/electron.api';
import { validWatchfacePath } from '../watchface-valid.utils';

/**
 * 通过pick modal选择文件或者目录
 * @param mode 模式
 * @param extensions 扩展名（在选择文件时有效）
 * @returns 选择的文件数组
 */
const openPickModal = async (
  mode?: 'file' | 'dir' | 'all',
  extensions?: string[],
  multi?: boolean
): Promise<string[]> => {
  extensions = extensions
    ? extensions.map((item) => item.replace(/^\./g, ''))
    : undefined;

  const res = await ElectronApi.ipcRenderer?.invoke('pick_file', {
    mode: mode,
    extensions: mode !== 'dir' ? extensions : undefined,
    multi
  });
  return res;
};

/**
 * 返回选择的文件， 可设置扩展名['jpg', 'png']，过滤文件
 * @returns path 返回单个路径或者路径数组（多选）
 */
export const pickFile = async (config: {
  extensions?: string[];
  multi?: boolean;
}): Promise<string | string[] | undefined> => {
  const { extensions, multi } = config;
  const res = await openPickModal('file', extensions, multi);
  return multi ? res : res?.[0];
};

/**
 * 返回选择的目录
 * @returns
 */
export const pickDir = async (): Promise<string | undefined> => {
  const res = await openPickModal('dir');
  return res?.[0];
};

/**
 * 返回选择目录和所有尺寸，如果目录选择错误则进行提示
 * @param mode 模式，选择目录、mtz包、全部，默认为全部
 * @returns 目录和第一个尺寸
 */
export const pickWatchfacePath = async (
  mode: 'file' | 'dir' | 'all' = 'all'
): Promise<
  | {
      path: string;
    }
  | undefined
> => {
  let path = (await openPickModal(mode))?.[0];

  // 用户未选择目录
  if (!path) return;

  // // 验证目录是否合法
  const valid = await validWatchfacePath(path);
  if (!valid) {
    console.log('非表盘文件目录，请重新选择');
    return;
  }

  // 验证成功，返回信息
  return {
    path
  };
};
