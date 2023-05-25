import { FolderService } from '@/services/folder.service';
import { ElectronApi } from '@/services/electron.api';
import { astToXml } from './xmlTool';
import { dataURItoBlob } from './fs/image.utils';
import mime from 'mime';
import { cloneDeep } from 'lodash-es';
import { emptyDir, ensureDir } from '@/utils/fs/fs-extra.utils';

export async function saveXml(watchAst: Ast) {
  const saveManifestPath = new FolderService().ResourcePath;
  await saveXmlToLocal(watchAst, saveManifestPath + '/manifest.xml');
}

/**
 * @method 将ast转成xml后写入到本地
 * @param {string} ast 表盘ast
 * @param {string} to 写入到的路径
 */
async function saveXmlToLocal(ast: Ast, to: string) {
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n${astToXml(ast)}`;
  const fs = ElectronApi.fs;
  const path = ElectronApi.path;
  if (!fs || !path) return;
  await ensureDir(path.dirname(to));
  await fs.promises.writeFile(to, xml, 'utf8');
}

export async function saveConfigJson(obj: object) {
  const fs = ElectronApi.fs;
  const path = ElectronApi.path;
  if (!fs || !path) return;

  const to = path.join(new FolderService().Path, 'editor.config.json');
  obj = cloneDeep(obj);
  await fs.promises.writeFile(to, JSON.stringify(obj, undefined, 2));
}

/**
 * 保存图片资源（使用新图片替换原来所有图片）
 * @param images
 * @todo 图片复用，去重
 */
export const saveImages = async (
  images: {
    base64: string;
    /**
     * 相对于resource路径的名称
     */
    basename: string;
  }[]
) => {
  const fs = ElectronApi.fs;
  const path = ElectronApi.path;
  if (!fs || !path) return;

  const folder = new FolderService();
  const ResourcePath = folder.ResourcePath;

  // 临时文件夹2
  const ResourcePathTemp = ResourcePath + '_temp';

  const _writeImages = async (dir: string) => {
    await ensureDir(dir);

    // 删除resource目录下所有图片类数据，
    for (const _filename of await fs.promises.readdir(dir)) {
      const filename = path.join(dir, _filename);
      const mimeType = mime.getType(filename);
      // 如果是图片资源，删除之
      if (mimeType?.includes('image')) {
        await fs.promises.rm(filename, { force: true });
      }
    }

    // 写入新资源
    // TODO 去重判断
    for (const image of images) {
      const { base64, basename } = image;
      const imageName = path.join(dir, basename);
      const blob = dataURItoBlob(base64);
      const arrBf = await blob.arrayBuffer();
      const dataView = new DataView(arrBf);
      await fs.promises.writeFile(imageName, dataView);
    }
  };

  try {
    // 拷贝一份备份，当发生错误时使用备份恢复
    await fs.promises.cp(ResourcePath, ResourcePathTemp, {
      force: true,
      recursive: true
    });
    await _writeImages(ResourcePath);
  } catch (error) {
    console.log(error);

    // 失败后，将其删除即可
    await emptyDir(ResourcePath);
    await fs.promises.rm(ResourcePath, { recursive: true, force: true });
    await fs.promises.cp(ResourcePathTemp, ResourcePath, {
      force: true,
      recursive: true
    });
  } finally {
    // 删除临时目录
    await fs.promises.rm(ResourcePathTemp, { recursive: true, force: true });
  }
};
