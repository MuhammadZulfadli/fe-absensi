<template>
  <header class="bg-white border-b border-outline-variant/30 px-6 py-4 sticky top-0 z-30">
    <div class="max-w-(--spacing-max-width) mx-auto flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <!-- Hamburger (mobile only, emitted to parent layout) -->
        <button
          v-if="showHamburger"
          @click="$emit('toggle-sidebar')"
          class="md:hidden mr-2 p-1.5 rounded hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface-variant"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-primary text-xl select-none">⚡</span>
        <span class="font-semibold text-lg tracking-tight text-on-background">
          AttendSync<span class="text-primary font-normal">Web</span>
        </span>
      </div>

      <!-- User Info & Logout -->
      <div class="flex items-center gap-4">
        <div v-if="userName" class="text-right hidden sm:block">
          <div class="font-semibold text-sm text-on-surface">{{ userName }}</div>
          <div class="text-xs text-on-surface-variant">{{ userRoleLabel }} &bull; {{ userNip }}</div>
        </div>
        <button
          @click="$emit('logout')"
          class="btn-secondary text-xs py-2 px-4 cursor-pointer"
        >
          Keluar
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userName: { type: String, default: '' },
  userRole: { type: String, default: '' },
  userNip:  { type: String, default: '' },
  showHamburger: { type: Boolean, default: false },
});

defineEmits(['logout', 'toggle-sidebar']);

const userRoleLabel = computed(() => {
  const map = { dosen: 'Dosen', mahasiswa: 'Mahasiswa' };
  return map[props.userRole] ?? props.userRole;
});
</script>
