export interface Description {
  name: string;
  deviceType: string | undefined;
  version?: string;
  pkgName?: string;
  size: string;
  author: string;
  description?: string;
  address: string;
  imageCompression: boolean;
  id?: string;
  type?: string;
}
