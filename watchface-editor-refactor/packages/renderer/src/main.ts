import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index';
import { createPinia, PiniaPlugin } from 'pinia';
import { PiniaLogger } from 'pinia-logger';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import {
  Button,
  Collapse,
  Checkbox,
  Dropdown,
  Form,
  Input,
  InputNumber,
  List,
  Menu,
  Modal,
  Result,
  Tooltip,
  Tree,
  Popover,
  Spin,
  Descriptions
} from 'ant-design-vue';

// tailwind1
import '@/styles/tailwind1.css';
// antd全局样式
import '@/styles/antd.less';
// 全局yangs
import '@/styles/global.less';
// tailwind2
import '@/styles/tailwind2.css';

// pinia
const pinia = createPinia();
if (import.meta.env.MODE == 'development') {
  pinia.use(
    PiniaLogger({
      expanded: false,
      disabled: true
    }) as PiniaPlugin
  );
}
pinia.use(piniaPersistedstate);

const app = createApp(App).use(pinia).use(router);

// 加载antd
app
  .use(Button)
  .use(Collapse)
  .use(Checkbox)
  .use(Modal)
  .use(Dropdown)
  .use(Form)
  .use(Input)
  .use(InputNumber)
  .use(Tooltip)
  // .use(Result)
  // .use(List)
  .use(Menu)
  .use(Tree);
// .use(Popover)
// .use(Descriptions)
// .use(Spin);

app.mount('#app');
