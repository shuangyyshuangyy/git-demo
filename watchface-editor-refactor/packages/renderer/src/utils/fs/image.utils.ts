import { ElectronApi } from '@/services/electron.api';
import mime from 'mime';

/**
 * 返回是否为图片类型文件
 * @param file
 * @returns
 */
export const isImageFile = (file: string) => {
  return !!mime.getType(file)?.includes('image');
};

/**
 * 获取图片dom
 * @param realpath相对路径
 * @param base64图片信息
 */
export async function loadImageDom(
  base64: string
): Promise<HTMLImageElement | null> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      console.log(error);
      reject('');
    };
    image.src = base64;
  });
}

/**
 * 返回图片base64数据
 * @param imagePath 图片目录
 */
export const getImageBase64 = async (imagePath: string) => {
  const fs = ElectronApi.fs;
  const path = ElectronApi.path;

  if (!imagePath || !fs || !path) return;

  const bf = await fs?.promises.readFile(imagePath);
  if (!bf) return;

  const _toBase64 = (bf: ArrayBuffer) => {
    const blob = new Blob([bf]);
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise<string | undefined>((resolve, reject) => {
      reader.onload = () => {
        const type = mime.getType(imagePath) ?? 'image/png';
        const base64 = reader.result
          ?.toString()
          .replace(/data:.*;base64,/, `data:${type};base64,`);
        resolve(base64);
      };
      reader.onerror = (e) => {
        console.log(e);

        reject();
      };
    });
  };

  return await _toBase64(bf.buffer);
};

/**
 * base64转blob
 * @param dataurl
 * @returns
 */
export function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * 返回图片尺寸信息
 * @param imagePath
 * @returns
 */
export const getImageSize = async (imagePath?: string, base64?: string) => {
  if (!base64) {
    if (!imagePath) {
      throw 'imagePath为空，当base64不存在时，imagePath必须提供';
    }
    base64 = base64 ?? (await getImageBase64(imagePath));
  }
  if (!base64) return;
  const imgDom = await loadImageDom(base64);
  return {
    width: imgDom?.width,
    height: imgDom?.height
  };
};
