import setData from './setData';
import getResources from './getResources';

import cleanRuntime from '../utils/cleanRuntime';
/**
 * @method maml预处理器
 * @param {object} runtime  Maml运行时数据
 */
export default function (runtime: Runtime): void {
  cleanRuntime(runtime);
  if (runtime?.ast?.children?.length) {
    // 数据分类
    setData(runtime);
    getResources(runtime);
  }
}
