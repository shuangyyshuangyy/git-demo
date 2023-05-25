# 表盘编辑器二期

## 脚本

```shell
# 安装依赖
yarn install

# 开启本地dev
yarn dev

# 打包
yarn build
# 打包时必须使用 yarn 或 npm 命令安装 node_modules
# 使用pnpm会出现依赖无法复制到electron的问题

```

## 目录结构

```
packages
│   ├── main        electron主进程
│   ├── preload     electron中的preload
│   └── renderer    渲染进程文件，vue目录
```
