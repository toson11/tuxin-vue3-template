<script setup lang="ts">
import { computed, PropType, toRaw } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { transformI18n } from "@/plugins/i18n";
import { type RouteRecordRaw, useRouter } from "vue-router";

defineOptions({
  name: "MenuItem"
});

const router = useRouter();
const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>
  }
});

const menuItem = computed(() => {
  const _item = props.item;
  if (_item.children?.length === 1) {
    // 如果只有一个子路由，且子路由的名称和父路由的名称相同，则直接显示子路由
    const child = _item.children[0];
    if (child.meta?.title === _item.meta?.title) return child;
  }
  return _item;
});
const hasSubMenu = computed(() => {
  const { children } = menuItem.value;
  return children && children.length > 0;
});
const Icon = computed(() => {
  const _icon = menuItem.value.meta?.icon;
  return useRenderIcon(toRaw(_icon));
});

const handleMenuItem = (menu: RouteRecordRaw) => {
  router.push({ name: menu.name });
};
</script>

<template>
  <el-sub-menu
    v-if="hasSubMenu"
    ref="subMenu"
    teleported
    :index="(menuItem.name as string) || menuItem.path"
  >
    <template #title>
      <component :is="Icon" />
      {{ transformI18n(menuItem.meta.title) }}
    </template>

    <MenuItem
      v-for="child in menuItem.children"
      :key="child.path"
      :item="child"
      class="nest-menu"
    />
  </el-sub-menu>
  <el-menu-item
    v-else
    :index="(menuItem.name as string) || menuItem.path"
    @click="handleMenuItem(menuItem)"
  >
    <template #title>
      <component :is="Icon" />
      {{ transformI18n(menuItem.meta.title) }}
    </template>
  </el-menu-item>
</template>
