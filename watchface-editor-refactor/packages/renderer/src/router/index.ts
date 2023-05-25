import { createRouter, createWebHashHistory } from 'vue-router';
import Editor from '@/views/editor/index.vue';
import Home from '@/views/home/index.vue';
import { WatchfaceStorage } from '@/hooks/use-watchface-history';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      meta: {
        tabs: true,
        title: '表盘编辑器'
      }
    },
    {
      name: 'editor',
      path: '/editor',
      component: Editor,
      meta: {
        tabs: true
      }
    }
  ]
});

router.beforeEach(async (to) => {
  const { fullPath } = to;

  if (!fullPath.includes('/editor')) return;
  if (to.query.path) return;

  // 增加默认的path
  await WatchfaceStorage.init();
  const path = WatchfaceStorage.data.value?.find((item) => item.active)?.path;
  if (!path) {
    return {
      name: 'home',
      replace: true
    };
  }
  if (!to.query.path) to.query.path = path;
});

export default router;
