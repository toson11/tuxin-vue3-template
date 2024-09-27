<!--
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-27 19:04:57
 * @FilePath: /tuxin-vue3-template/src/components/base/BasePageContent.vue
 * @Description: 页面内容容器
-->
<template>
  <div class="page-content">
    <slot name="header" />
    <slot name="main" />
    <div v-if="$slots.default" shadow="never" class="content-card">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  margin: {
    type: String,
    default: "20px"
  },
  cardPadding: {
    type: String,
    default: "20px"
  }
});
</script>
<style scoped lang="scss">
.page-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: v-bind(margin); // stylelint-disable-line
  .content-card {
    flex: 1;
    background-color: #fff;
    border-radius: 4px;
    padding: v-bind(cardPadding); // stylelint-disable-line
  }
}
</style>
