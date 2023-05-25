# 小米可穿戴设备渲染引擎

## 在 vue 中使用

```vue
<template>
  <canvas ref="canvas" width="368" height="448"></canvas>
</template>
<script>
import Renderer from "../watch-renderer";

export default {
  data() {
    return {
      renderer: null
    };
  },

  mounted() {
    const code = `
    <watchface name="tourbillon-series">
      <Resources>
        <Image name="bg" src="images/bg.png"/>
        <Image name="imgPreview" src="images/preview.png"/>
        <Image name="img1" src="images/img1.png"/>
        <Image name="img2" src="images/img2.png"/>
      </Resources>
      <Theme type="normal" name="tourbillonNormal" bg="bg" preview="imgPreview">
        <Layout name="layoutImageLeftFill" ref="#img1" x="137" y="248" w="20" h="19" />
        <!-- Use the actual resource size if w=0 and h=0 -->
        <Layout name="layoutImageRightFill" ref="#img2" x="301" y="251"/>
      </Theme>
      <Theme type="dark" name="TourbillonDark" bg="" preview="">
      </Theme>
      <Theme type="AOD" name="TourbillonAOD" bg="" preview="">
      </Theme>
    </watchface>
    `;

    // 创建表盘渲染实例
    this.renderer = new Renderer(
      this.$refs.canvas,
      {
        xml: code
        images: {...}
      }
    );
    // 开始绘图
    this.renderer.render();
  }
};
</script>
```

## 参数

new renderer(canvas,config)

- canvas:传入页面中已挂载的 canvas 对象,必传
- config 参数:自定义参数

config 对象可传参数

| 参数   | 含义                                            |
| ------ | ----------------------------------------------- |
| ast    | 解析后的 表盘 ast                               |
| xml    | 表盘 原始 xml 字符串,xml 与 ast 两者只需传一个  |
| images | 可选,传入引用的图片数据 image 对象              |
| tick   | 可选,自动刷新动画 true 或 false,默认 true       |
| type   | 可选,渲染的主题模式,normal\dark\AOD,默认 normal |

其他框架(如 react)的使用方式与 vue 类似,只需传入页面中的 canvas 对象及相关参数

## reset 方法

更新渲染实例数据,传入代码及图片数据

```js
this.renderer.reset({ ast: {}, images: {} });
```

reset 时支持的参数同上面 config 的参数
