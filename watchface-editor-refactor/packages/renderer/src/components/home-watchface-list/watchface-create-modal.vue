<template>
  <a-modal
    v-model:visible="visible"
    title="表盘信息"
    :width="515"
    ok-text="确认"
    cancel-text="取消"
    @cancel="() => (visible = false)"
    @ok="submit"
  >
    <div class="flex-row">
      <div class="form_item">
        <span class="form_label">表盘名称</span>
        <FormInput
          :initial-input="String(formState.name)"
          @change-value="setName"
          ref="nameRef"
        ></FormInput>
      </div>
      <div class="flex mt-[20px] h-[80px]">
        <span class="form_label">表盘类型</span>
        <div class="flex">
          <div
            class="w-[50px] h-[50px] rounded-[40px]"
            :style="{
              backgroundColor: formState.type == '圆形' ? '#F9F9F9' : '#ACACAC'
            }"
            @click="($event) => (formState.type = '圆形')"
          ></div>
          <div
            class="w-[40px] h-[50px] ml-[30px] rounded-[10px] flex content-center items-center"
            :style="{
              backgroundColor: formState.type == '方形' ? '#F9F9F9' : '#ACACAC'
            }"
            @click="($event) => (formState.type = '方形')"
          ></div>
          <div
            class="w-[20px] h-[50px] ml-[30px] rounded-[15px] flex content-center items-center"
            :style="{
              backgroundColor: formState.type == '跑道' ? '#F9F9F9' : '#ACACAC'
            }"
            @click="($event) => (formState.type = '跑道')"
          ></div>
        </div>
      </div>
      <div class="form_item">
        <span class="form_label">设备型号</span>
        <div>
          <select
            class="rounded border-[#454545] border bg-black-50 w-[150px] h-[30px] text-[16px]"
            v-model="formState.deviceType"
          >
            <option
              class="text-[16px]"
              v-for="item in option1"
              v-bind:value="item.name"
              v-bind:key="item.name"
            >
              {{ item.name }}
            </option>
          </select>
          <span class="ml-[10px] text-[15px] text-{#c6c6c6}">{{
            formState.size
          }}</span>
        </div>
      </div>

      <div class="form_item">
        <div class="form_label">文件压缩</div>
        <p class="">
          <input
            type="radio"
            value="false"
            v-model="formState.imageCompression"
          />不启用
          <input
            class="ml-[20px]"
            type="radio"
            value="true"
            v-model="formState.imageCompression"
          />启用
        </p>
      </div>
    </div>
    <div class="form_item">
      <div class="form_label">保存地址</div>
      <div class="flex-row justify-start ml-[30px] w-[100%]">
        <div class="flex items-center" @click="onSearch">
          <Icon icon="fileDir.svg" :width="20" :height="20" />
          <span class="bg-gray ml-[10px] text-xs truncate">{{
            formState.address
          }}</span>
        </div>
        <div>
          <span class="text-xs text-red-700" v-show="isUnSelectAddress"
            >请选择保存地址</span
          >
        </div>
      </div>
    </div>
    <div class="flex items-center mb-[20px] form_label h-[40px]">
      <span class="">高级设置</span>
      <div class="stop-icon" @mousedown.stop="showSetting">
        <Icon
          icon="saveContent.svg"
          :width="15"
          :height="15"
          v-if="showHighSetting"
        />
        <Icon icon="showContent.svg" :width="15" :height="15" v-else />
      </div>
    </div>
    <div v-show="showHighSetting">
      <div class="form_item">
        <div class="form_label">包名</div>
        <FormInput
          :initial-input="String(formState.pkgName)"
          @change-value="setPkgname"
          ref="pkgRef"
        ></FormInput>
      </div>
      <div class="form_item">
        <div class="form_label">版本号</div>
        <FormInput
          :initial-input="String(formState.version)"
          @change-value="setVersion"
          ref="versionRef"
        ></FormInput>
      </div>
      <div class="form_item">
        <div class="form_label">设计师</div>
        <FormInput
          :initial-input="String(formState.author)"
          @change-value="setAuthor"
          ref="authorRef"
        ></FormInput>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { pickDir } from '@/utils/fs/pick-file.utils';
import { useWatchfaceManage } from '@/hooks';
import { Description } from '@/types/watchface';
import generateID from '@/utils/generate-id';
import { ElectronApi } from '@/services/electron.api';
import { uniqueFileName } from '@/utils/fs/fs-extra.utils';
import { FolderService } from '@/services/folder.service';
import { emitter, EventType } from '@/utils/emitter.utils';

const { createWatchface, openNewWatchface } = useWatchfaceManage();
//验证
const nameRef = ref();
const pkgRef = ref();
const versionRef = ref();
const authorRef = ref();

const visible = ref(false);
const showHighSetting = ref(false);
const isUnSelectAddress = ref(false);
const formState: Description = reactive({
  name: '',
  deviceType: undefined,
  version: '1.0',
  pkgName: '',
  size: '',
  author: 'designer-xxx',
  imageCompression: false,
  address: '',
  id: '', //暂时没用到
  type: '圆形'
});

// 打开或关闭modal
const data = reactive<{
  path?: string;
  mode?: 'create' | 'edit';
  show?: boolean;
}>({});
const open = async (_data?: { path?: string; mode?: 'create' | 'edit' }) => {
  data.mode = _data?.mode ?? 'create';
  data.path = _data?.path;
  data.show = true;
  initalData();
};
defineExpose({ open });
const initalData = async () => {
  const watchfacePath = data.path;
  const res = watchfacePath
    ? await new FolderService(watchfacePath).getDescriptionData()
    : undefined;
  formState.name = res?.name ?? '';
  formState.deviceType = res?.deviceType ?? undefined;
  formState.version = res?.version ?? '1.0';
  formState.pkgName = res?.pkgName ?? '';
  formState.size = res?.size ?? '';
  formState.author = res?.author ?? '';
  formState.imageCompression = res?.imageCompression ?? false;
  let list = data.path?.split('\\');
  let path = list?.slice(0, list.length - 1).join('\\');
  formState.address = path ?? '';
  formState.id = res?.id ?? '';
  formState.type = res?.type ?? '圆形';
  visible.value = true;
};

const option = [
  { name: 'M62', type: 'circle' },
  { name: 'K62/K63', type: 'circle' },
  { name: 'L61Simulator', type: 'circle' },
  { name: 'L61', type: 'circle' },
  { name: 'N60', type: 'circle' },
  { name: 'M65S', type: 'square' },
  { name: 'K65', type: 'square' },
  { name: 'K65A', type: 'square' },
  { name: 'K67', type: 'square' },
  { name: 'L67', type: 'square' },
  { name: 'M66', type: 'run' }
];

const option1 = computed(() => {
  if (formState.type == '圆形') {
    formState.deviceType = 'M62';
    return option.filter((item) => item.type == 'circle');
  } else if (formState.type == '方形') {
    formState.deviceType = 'M65S';
    return option.filter((item) => item.type === 'square');
  } else {
    formState.deviceType = 'M66';
    return option.filter((item) => item.type === 'run');
  }
});

watch(
  () => formState.deviceType,
  (newValue, oldValue) => {
    if (newValue) onSelect(newValue);
  }
);

const setName = (value: string) => {
  formState.name = value;
};
const setPkgname = (value: string) => {
  formState.pkgName = value;
};
const setVersion = (value: string) => {
  formState.version = value;
};
const setAuthor = (value: string) => {
  formState.author = value;
};

const onSelect = (e: string) => {
  switch (e) {
    case 'K65':
      formState.size = '320x360';
      break;
    case 'K65A':
      formState.size = '320x360';
      break;
    case 'K67':
      formState.size = '194x368';
      break;
    case 'L61':
      formState.size = '480x480';
      break;
    case 'L61Simulator':
      formState.size = '480x480';
      break;
    case 'L65':
      formState.size = '390x450';
      break;
    case 'L67':
      formState.size = '280x456';
      break;
    case 'M65S':
      formState.size = '390x450';
      break;
    case 'M66':
      formState.size = '192x490';
      break;
    default:
      formState.size = '466x466';
      break;
  }
};

// 当所在目录和名称修改后需要设置默认名称
watch([() => formState.address, () => formState.name], async () => {
  if (!formState.address || !formState.name) {
    return;
  }
  let basename: undefined | string = formState.name;
  basename = await uniqueFileName({ dir: formState.address, basename });
  if (basename) formState.name = basename;
});
const onSearch = async () => {
  //替换路径
  const path = await pickDir();
  if (path) {
    formState.address = path;
    isUnSelectAddress.value = false;
  }
};
const showSetting = () => {
  showHighSetting.value = showHighSetting.value == true ? false : true;
};

const formValidaty = () => {
  //验证输入
  nextTick(() => {
    nameRef.value.checkInput();
    pkgRef.value.checkInput();
    versionRef.value.checkInput();
    authorRef.value.checkInput();
  });
  if (formState.address == '') {
    isUnSelectAddress.value = true;
  }
  if (
    nameRef.value.checkInput() &&
    pkgRef.value.checkInput() &&
    versionRef.value.checkInput() &&
    authorRef.value.checkInput() &&
    formState.address !== ''
  ) {
    return true;
  }
  showHighSetting.value = true;
  return false;
};

const submit = async () => {
  let validaty = formValidaty();
  if (!(await validaty).valueOf()) return;
  // 新建或者编辑
  data.mode == 'create' ? handleCreate() : handleUpdate();
};

const handleCreate = async () => {
  formState.id = 'watchface_unique_id' + '_' + generateID();
  const description: Description = { ...formState };
  await createWatchface({
    description
  });
  const path = ElectronApi.path?.join(formState.address, formState.name) ?? '';
  await openNewWatchface(path);
  visible.value = false;
};
const handleUpdate = async () => {
  try {
    const service = new FolderService(data.path);
    const description: Description = { ...formState };
    await service.writeDecsriptionXML(description);
  } catch (error) {
    console.error('修改发生错误：', error);
  } finally {
    visible.value = false;
    emitter.emit(EventType['watchface:description-update']);
  }
};
</script>

<style scoped>
.form_item {
  display: flex;
  margin-bottom: 20px;
  height: 40px;
}
.form_label {
  width: 100px;
  margin-right: 20px;
  font-size: 15px;
  color: #c6c6c6;
}
</style>
