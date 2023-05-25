interface Window {
  electron?: import('../../../preload/src/index').ElectronApi;
  onetrack?: (
    track: 'track' | 'init',
    eventName: string,
    params?: Record<string, string>
  ) => void;
}
interface BaseSelectItem {
  label: string;
  value: string | number;
  selectable?: boolean | ((item: BaseSelectItem) => boolean);
  children?: BaseSelectItem[];
  extra?: Record<string, any>;
}

interface DropDownMenuItem {
  icon?: string;
  disabled?: boolean | ((data: DropDownMenuItem) => boolean);
  hidden?: boolean;
  title?: string;
  delimiter?: boolean | string;
  shortcuts?: import('@/hooks/use-global-shortcuts').KeyboardKey[];
  onClick?: () => void;
  children?: DropDownMenuItem[];
}
