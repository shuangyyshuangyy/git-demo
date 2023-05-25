import { FolderService } from '@/services/folder.service';
import { testAccess } from './fs/fs-extra.utils';

/**
 * return true if path is widget path
 * @param path widget path
 */
export const validWatchfacePath = async (path: string): Promise<boolean> => {
  const service = new FolderService(path);

  const ensureDirs = [path, service.descriptionXmlPath ?? ''];
  let ensure = true;
  for (const dir of ensureDirs) {
    if (!ensure) break;
    if (!(await testAccess(dir))) {
      console.log('WatchfacePath无效目录：以下目录不存在 ->', dir);
      ensure = false;
    }
  }
  if (!ensure) return false;
  return true;
};
