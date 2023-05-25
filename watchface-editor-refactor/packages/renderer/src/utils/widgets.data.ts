export const PointerWidget: CustomWidget[] = [
  {
    type: 'ThreePointers',
    layerName: '时钟一',
    w: 200,
    h: 200,
    preview: 'base64:png;',
    children: [
      {
        tag: 'Image',
        name: 'bg',
        layerName: '表盘背景',
        x: 100,
        y: 100,
        w: 200,
        h: 200,
        src: ''
      },
      {
        tag: 'Image',
        name: 'hour_pointer',
        layerName: '时针',
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        pivotX: 100,
        pivotY: 100,
        source: 'hour',
        ref: {
          tag: 'Image',
          name: 'hour_pointer_img',
          src: ''
        }
      },
      {
        tag: 'Image',
        name: 'minute_pointer',
        layerName: '分针',
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        pivotX: 100,
        pivotY: 100,
        source: 'minute',
        ref: {
          tag: 'Image',
          name: 'minute_pointer_img',
          src: ''
        }
      },
      {
        tag: 'Image',
        name: 'second_pointer',
        layerName: '秒针',
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        pivotX: 100,
        pivotY: 100,
        source: 'hour',
        ref: {
          tag: 'Image',
          name: 'second_pointer_img',
          src: ''
        }
      }
    ]
  }
];
