import { useWatchfaceStore } from '../store/use-watchface-store';
import { ElectronApi } from './electron.api';
import { XMLParser } from 'fast-xml-parser';
import { Description } from '@/types/watchface';
import { descriptionToXML, xmlToAst } from '@/utils/xmlTool';
import {
  getImageBase64,
  getImageSize,
  isImageFile
} from '@/utils/fs/image.utils';
import { ensureDir } from '@/utils/fs/fs-extra.utils';
import { xmlToJson } from '@/utils/xmlTool/xmlToJson';

type ImageBase64 = string;

export interface ResourceItem {
  realpath: string; // 绝对路径
  /**
   * 在maml中可直接使用的路径
   */
  basename: string; // 相对路径
  value?: ImageBase64;
  // children?: ResourceItem[];
}

export class FolderService {
  private _path: string;

  constructor(path?: string) {
    this._path = path || '';
  }

  get Path() {
    return this._path === '' ? useWatchfaceStore().path ?? '' : this._path;
  }
  get ResourcePath() {
    return ElectronApi.path?.join(this.Path, 'resources') || '';
  }

  /**
   * 返回manifest.xml所在路径
   */
  get manifestXmlPath() {
    return ElectronApi.path?.join(this.ResourcePath ?? '', 'manifest.xml');
  }

  /**
   * 返回description.xml文件路径
   */
  get descriptionXmlPath() {
    return ElectronApi.path?.join(this.Path, 'description.xml');
  }

  async writeImage(filePath: string, name: string, toSrcName?: string) {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;
    const imgPath = path.join(this.ResourcePath, toSrcName ?? name);
    let writeImgName = name.split('.')[0];
    if (!fs || !path) return;
    if (fs.existsSync(filePath)) {
      await ensureDir(this.ResourcePath);
      await fs.promises.cp(filePath, imgPath);
    }
    const { width, height } = (await getImageSize(imgPath)) ?? {};
    return { width, height, writeImgName };
  }

  async getImageStoreData(imgName: string, base64: string) {
    const dir = this.ResourcePath;
    const path = ElectronApi.path;
    const realpath = path?.join(dir, imgName);
    if (realpath) {
      const item: ResourceItem = {
        realpath: realpath,
        basename: imgName
      };
      item['value'] = base64;
      return item;
    }
  }

  async getImagesData() {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;

    const dir = this.ResourcePath;
    if (dir) {
      const filenames = await fs.promises.readdir(dir);
      const res: ResourceItem[] = [];

      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        // const _basename = path.basename(dir) + '/' + filename;
        const realpath = path.join(dir, filename);
        if (!fs.existsSync(realpath)) continue;
        const isValidImg = isImageFile(realpath);
        if (!isValidImg) continue;
        const item: ResourceItem = {
          realpath: realpath,
          basename: filename
        };

        item['value'] = await getImageBase64(realpath);
        res.push(item);
      }
      return res;
    }
  }

  /**
   * 获取description基本信息
   * @returns
   */
  async getDescriptionData() {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;

    const descriptionXml = this.descriptionXmlPath;
    if (!descriptionXml) return;

    // 读取description.xml
    const content = await fs.promises.readFile(descriptionXml, 'utf-8');
    if (!content) return;

    const res = xmlToJson(content) ?? {};

    return res as unknown as Description;
  }

  async getEditorData() {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;

    const configPath = path.join(this.Path, 'editor.config.json');
    // 读取 editor.config.json
    try {
      const content = await fs.promises
        .readFile(configPath, 'utf8')
        .then((r) => JSON.parse(r));
      return content;
    } catch (e) {
      console.log('缺少项目文件!');
    }
  }

  /**
   * 读取manifest数据，并转为带有根目录的ast
   * @returns
   */
  async getManifestAstData(): Promise<Ast | undefined> {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;

    const manifestXml = this.manifestXmlPath;
    if (!manifestXml || !fs.existsSync(manifestXml)) return;

    const content = await fs.promises.readFile(manifestXml, 'utf-8');
    if (!content) return;

    const ast = xmlToAst(content);

    // 重新写入
    // if (reWrite) {
    //   this.writeManifestXml(ast);
    // }
    return ast;
  }

  /**
   * 写入description文件
   * @param ast 需要写入的ast
   * @returns
   */
  async writeDecsriptionXML(description: Description) {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;

    const xml = descriptionToXML(description, ['address']);

    const descriptionXmlPath = this.descriptionXmlPath;
    if (!descriptionXmlPath) return;

    await ensureDir(path.dirname(descriptionXmlPath));
    await fs.promises.writeFile(descriptionXmlPath, xml, 'utf-8');
  }
}
