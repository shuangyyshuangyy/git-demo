// 返回8位随机字符串
export default function generateID() {
  return Math.random().toString(36).slice(-6);
}

export function uuidWithPrefix(prefix: string) {
  return `${prefix}_${generateID()}`;
}