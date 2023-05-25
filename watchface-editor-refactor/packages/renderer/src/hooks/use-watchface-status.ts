import { useLayerStore } from '@/store/use-layer-store';
import { EventType } from '@/utils/emitter.utils';
import { onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useWatchfaceManage, watchfaceOpening } from './use-watchface-manage';
import { useEmitterListener } from './use-event-listener';
import { debounce } from 'lodash-es';

type Status = 'saved' | 'unsaved' | 'saving';
const status = ref<Status>();

/**
 * 自动保存时间：minutes
 */
const autoSave = ref<number>(5);
const _timer = ref<NodeJS.Timer>();

export const useWatchfaceStatus = () => {
  const layerStore = useLayerStore();
  const { saveWatchfaceData } = useWatchfaceManage();

  const setStatus = (val: Status) => {
    status.value = val;
  };

  const _lastStore = reactive({
    layer: ''
  });

  const _setUnsavedOnChange = debounce(() => {
    const _layer = JSON.stringify(layerStore.$state.themes);

    const { layer } = _lastStore;
    if (_layer == layer) {
      status.value = 'saved';
    } else {
      status.value = 'unsaved';
    }
  }, 50);

  // 当需要保存时
  [layerStore].forEach((store) => {
    store.$subscribe(() => {
      if (watchfaceOpening.value) return;
      _setUnsavedOnChange();
    });
  });

  useEmitterListener(
    [EventType['watchface:opened'], EventType['watchface:saved']],
    () => {
      status.value = 'saved';
    }
  );

  const _closeAutoSave = () => {
    if (_timer.value) clearTimeout(_timer.value);
  };

  watch(status, (val) => {
    // 如果是已保存，则取消自动保存
    if (val == 'saved') {
      _closeAutoSave();
      // 获取本次保存的数据
      try {
        _lastStore.layer = JSON.stringify(layerStore.$state.themes);
      } catch (error) {
        _lastStore.layer = '';
      }
    }

    // 如果是未保存，则需要开启自动保存
    if (val == 'unsaved') {
      // clear previous
      _closeAutoSave();
      // set new timer
      _timer.value = setTimeout(() => {
        // 发送自动保存事件
        saveWatchfaceData();
      }, autoSave.value * 60 * 1000);
    }
  });

  onBeforeUnmount(() => {
    _closeAutoSave();
  });

  return {
    status,
    setStatus
  };
};
