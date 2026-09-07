<template>
  <div class="min-h-screen bg-background flex flex-col font-sans">
    <!-- Header -->
    <AppHeader
      :user-name="user?.nama"
      :user-role="user?.role"
      :user-nip="user?.nim_nip"
      :show-hamburger="true"
      @logout="handleLogout"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />

    <!-- Sidebar + Content -->
    <div class="flex flex-grow max-w-(--spacing-max-width) w-full mx-auto">

      <!-- Mobile Overlay -->
      <Transition name="overlay">
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
          @click="isSidebarOpen = false"
        />
      </Transition>

      <!-- Sidebar -->
      <Transition name="slide">
        <aside
          class="
            fixed md:static inset-y-0 left-0 z-30
            w-[260px] bg-(--color-sidebar-bg) text-white
            flex flex-col justify-between py-6 shrink-0
            min-h-screen md:min-h-[calc(100vh-73px)]
            border-r border-[#1e3a8a]
            transition-transform duration-300 ease-in-out
          "
          :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
        >
          <nav class="flex flex-col gap-1 w-full">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              @click="isSidebarOpen = false"
              v-slot="{ isActive }"
              custom
            >
              <a
                :href="item.to"
                @click.prevent="navigateTo(item.to)"
                class="flex items-center gap-3 py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4"
                :class="isActive
                  ? 'border-primary bg-white/10 text-white'
                  : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'"
              >
                <span class="text-base leading-none">{{ item.icon }}</span>
                {{ item.label }}
              </a>
            </router-link>
          </nav>

          <div class="px-6 text-xs text-white/40 select-none">
            AttendSync Panel Dosen
          </div>
        </aside>
      </Transition>

      <!-- Main Content -->
      <main class="flex-grow p-gutter bg-background min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from './AppHeader.vue';
import authService from '../services/auth';

const router = useRouter();
const user = ref(null);
const isSidebarOpen = ref(false);

const navItems = [
  { to: '/dosen/dashboard',    icon: '🏠', label: 'Dashboard' },
  { to: '/dosen/mata-kuliah',  icon: '📚', label: 'Kelola Mata Kuliah' },
  { to: '/dosen/laporan',      icon: '📝', label: 'Laporan Absensi' },
];

onMounted(() => {
  user.value = authService.getUser();
});

const navigateTo = (path) => {
  isSidebarOpen.value = false;
  router.push(path);
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
