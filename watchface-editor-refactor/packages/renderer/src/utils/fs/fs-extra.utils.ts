import { ElectronApi } from '@/services/electron.api';

/**
 * 检查文件或路径是否存在
 * @param path
 * @returns
 */
export const testAccess = async (path: string) => {
  try {
    const fs = ElectronApi.fs;
    await fs?.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 返回目录类型
 * @param path
 * @param type
 * @returns
 */
const _getType = async (
  filename: string
): Promise<'directory' | 'file' | undefined> => {
  const S_IFMT = 61440; /* 0170000 type of file */
  const S_IFDIR = 16384; /* 0040000 directory */
  const S_IFREG = 32768; /* 0100000 regular */

  const fs = ElectronApi.fs;
  if (!fs || !(await testAccess(filename))) return;
  const { mode } = await fs.promises.stat(filename);
  const res = mode & S_IFMT;
  if (res === S_IFDIR) return 'directory';
  if (res === S_IFREG) return 'file';
};

/**
 * 判断路径是否为目录
 */
export const isDirectory = async (path: string) => {
  return (await _getType(path)) == 'directory';
};

/**
 * 判断路径是否为文件
 */
export const isFile = async (path: string) => {
  return (await _getType(path)) == 'file';
};

/**
 * 检查文件名，是否重复。如重复则增加标识
 * @param filename
 */
export const uniqueFileName = async ({
  basename,
  dir
}: {
  basename: string;
  dir: string;
}) => {
  const path = ElectronApi.path;
  const fs = ElectronApi.fs;
  if (!path || !fs) return;
  const basenames = await fs.promises.readdir(dir);

  let flag = 1;
  basenames.forEach((_basename: any) => {
    if (_basename == basename) {
      flag++;
      basename = flag > 1 ? basename + ' ' + flag : basename;
    }
  });

  return basename;
};

export const ensureDir = async (dir: string) => {
  const fs = ElectronApi.fs;
  if (!fs) return;
  if (await testAccess(dir)) return;
  await fs.promises.mkdir(dir, { recursive: true });
};

export const emptyDir = async (dir: string) => {
  const fs = ElectronApi.fs;
  const path = ElectronApi.path;
  if (!fs || !path) return;
  if (!(await isDirectory(dir))) return;

  const files = await fs.promises.readdir(dir);
  for (const _file of files) {
    const _filename = path.join(dir, _file);
    await fs.promises.rm(_filename, { recursive: true, force: true });
  }
};
