/* eslint-disable @typescript-eslint/no-explicit-any */
import { emitter, EventType } from '@/utils/emitter.utils';
import { onBeforeUnmount, onMounted } from 'vue';
// import { handleKeyboardEvent, ShortcutConfig } from '@/utils/keyboard.utils';

export const useEventListener = <T>(
  event: 'keydown' | 'mousedown' | 'blur' | 'focus' | 'wheel' | 'paste',
  handler: (e: T) => void,
  target?: HTMLElement | Document
) => {
  const _handler = (e: Event) => {
    handler(e as T);
  };
  onMounted(() => {
    const element = typeof target !== 'undefined' ? target : window;
    element.addEventListener(event, _handler);
  });
  onBeforeUnmount(() => {
    const element = typeof target !== 'undefined' ? target : window;
    element.removeEventListener(event, _handler);
  });
};

export const useEmitterListener = (
  event: EventType | EventType[],
  handler: (data?: any) => void
) => {
  const _handler = (data?: any) => {
    handler(data);
  };
  onMounted(() => {
    emitter.on(event, _handler);
  });
  onBeforeUnmount(() => {
    emitter.off(event, _handler);
  });
};
