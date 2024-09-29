<script setup lang="ts">
import { docsRoutes } from "@/router";
import MenuItem from "./components/MenuItem.vue";
</script>

<template>
  <div>
    <el-menu
      ref="menuRef"
      mode="horizontal"
      popper-class="pure-scrollbar"
      class="horizontal-header-menu"
      :default-active="$route.name as string"
    >
      <MenuItem
        v-for="route in docsRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <router-view />
  </div>
</template>
