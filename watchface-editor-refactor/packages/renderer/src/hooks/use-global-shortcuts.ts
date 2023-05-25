import { ElectronApi } from '@/services/electron.api';
import { isMac } from '@/utils/platform';
import { onBeforeUnmount, onMounted } from 'vue';

export type KeyboardKey =
  /**
   * 在不同平台对应不同值
   */
  | 'CommandOrControl'
  | 'Control'
  | 'Delete'
  | 'Escape'
  | 'Space'
  | 'Backspace'
  | 'Shift'
  | 'Alt'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'F5'
  | 'F12'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | '['
  | ']'
  | '+'
  | '-'
  | '=';

interface ShortcutBind {
  keyboardKeys: KeyboardKey[];
  handler: (e: KeyboardEvent) => void;
}

export const handleKeyboardEvent = (
  e: KeyboardEvent,
  shortcuts: ShortcutBind[]
) => {
  // 不区分left和right，如不区分shift left和shift right
  const valid = (e: KeyboardEvent, keys: KeyboardKey[]) => {
    // 先查找普通键
    const _keys = keys.filter((item) => {
      return !['CommandOrControl', 'Control', 'Shift', 'Alt'].includes(item);
    });
    // 仅能存在一个普通按键
    if (_keys.length !== 1) {
      console.error(
        '普通按键数量错误，必须确保有且只有一个普通按键，当前的普通按键为',
        keys
      );
      return;
    }
    const _key = _keys[0];
    if (_key == undefined || _key.toLowerCase() !== e.key.toLowerCase()) {
      return false;
    }

    const isDarwin = isMac();
    const needMeta = isDarwin && keys.includes('CommandOrControl');
    if (e.metaKey !== needMeta) return false;

    const needCtrl = !isDarwin && keys.includes('CommandOrControl');
    if (e.ctrlKey !== needCtrl) return false;

    if (e.shiftKey !== keys.includes('Shift')) return false;
    if (e.altKey !== keys.includes('Alt')) return false;

    return true;
  };

  // 遍历events，执行相应的事件
  shortcuts.forEach((shortcut) => {
    const { keyboardKeys, handler } = shortcut;
    // 判断是否满足keys
    if (valid(e, keyboardKeys)) {
      try {
        handler?.(e);
      } catch (error) {
        console.log('执行快捷键命令出错', error);
      }
    }
  });
};

/**
 * 注册全局快捷键
 * @param shortcuts
 */
export const useGlobalShortcuts = (
  shortcuts: ShortcutBind[],
  condition?: (e: KeyboardEvent) => boolean
) => {
  // 验证shortcuts
  const _handler = (e: KeyboardEvent) => {
    const cond = condition ? condition(e) : true;
    if (cond) {
      handleKeyboardEvent(e, shortcuts);
    }
  };
  onMounted(() => {
    window.addEventListener('keydown', _handler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', _handler);
  });
};
