import { useGlobalShortcuts, useWatchfaceManage, watchfaceOpening } from '.';
import { ref } from 'vue';
import { useSnapshot } from './use-snapshot';
import { useEmitterListener } from './use-event-listener';
import { Shape } from '@/services/shape';
import { EventType } from '@/utils/emitter.utils';
import { useLayerStore } from '@/store/use-layer-store';

export const useEditorShortcutsSnapshot = () => {
  const { record, clear, undo, redo } = useSnapshot();
  const { saveWatchfaceData } = useWatchfaceManage();
  const layerStore = useLayerStore();

  // 注册全局快捷键
  useGlobalShortcuts([
    // 撤销
    {
      keyboardKeys: ['CommandOrControl', 'Z'],
      handler: async () => {
        await undo();
      }
    },
    // 恢复
    {
      keyboardKeys: ['CommandOrControl', 'Shift', 'Z'],
      handler: async () => {
        await redo();
      }
    },
    // 保存
    {
      keyboardKeys: ['CommandOrControl', 'S'],
      handler: async () => {
        await saveWatchfaceData();
      }
    }
  ]);

  // snapshot
  useEmitterListener(EventType['watchface:opened'], async () => {
    await clear();
    await record();
  });
  const snapshotKey = ref(0);
  useEmitterListener(EventType['undo-redo'], () => {
    Shape.clearCache();
    snapshotKey.value = Math.random();
  });

  // 当图片数据变动时
  useEmitterListener(
    [
      // 当layer数据变动
      EventType['shape:create'],
      EventType['shape:deleted'],
      EventType['shape:set-attr'],
      // 当theme数据变动时
      EventType['theme:create'],
      EventType['theme:move'],
      EventType['theme:delete'],
      EventType['theme:set-attr']
    ],
    async () => {
      await record();
    }
  );

  return { snapshotKey };
};
