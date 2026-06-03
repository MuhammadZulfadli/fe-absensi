<template>
  <div class="min-h-screen bg-background flex flex-col font-sans">
    <!-- Top Header -->
    <header class="bg-white border-b border-outline-variant/30 px-6 py-4 sticky top-0 z-30">
      <div class="max-w-(--spacing-max-width) mx-auto flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="text-primary text-xl">⚡</span>
          <span class="font-semibold text-lg tracking-tight text-on-background">AttendSync<span class="text-primary font-normal">Web</span></span>
        </div>

        <!-- User Info & Logout -->
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <div class="font-semibold text-sm text-on-surface">{{ user?.nama }}</div>
            <div class="text-xs text-on-surface-variant">Dosen &bull; {{ user?.nim_nip }}</div>
          </div>
          <button @click="handleLogout" class="border border-outline/30 text-on-surface-variant hover:bg-surface-container-low font-medium text-xs py-2 px-4 rounded transition-colors cursor-pointer">
            Keluar
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar + Main Content Layout -->
    <div class="flex flex-grow max-w-(--spacing-max-width) w-full mx-auto">
      <!-- Side Navigation -->
      <aside class="w-[260px] bg-[#1e3a8a] text-white flex flex-col justify-between py-6 shrink-0 hidden md:flex min-h-[calc(100vh-73px)] border-r border-[#1e3a8a]">
        <nav class="flex flex-col gap-1 w-full">
          <router-link to="/dosen/dashboard" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">
            Dashboard
          </router-link>
          <router-link to="/dosen/mata-kuliah" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">
            Kelola Mata Kuliah
          </router-link>
          <router-link to="/dosen/laporan" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-primary bg-white/10 text-white">
            Laporan Absensi
          </router-link>
        </nav>
        <div class="px-6 text-xs text-white/40">
          AttendSync Panel Dosen
        </div>
      </aside>

      <!-- Main Stage -->
      <main class="flex-grow p-gutter bg-[#f9fafb]">
        <!-- Content Card -->
        <div class="bg-white border border-[#e5e7eb] rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h1 class="text-2xl font-bold tracking-tight text-on-surface mb-1">Laporan Absensi</h1>
          <p class="text-sm text-on-surface-variant mb-8">Rekap kehadiran mahasiswa per mata kuliah.</p>
          
          <!-- Placeholder Area -->
          <div class="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-16 flex flex-col items-center justify-center text-center">
            <span class="text-3xl opacity-40 mb-3">📝</span>
            <p class="text-xs text-on-surface-variant/75 font-medium italic">Fitur Laporan Absensi dalam pengerjaan (Menunggu Isu FE-08)</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/auth';

const router = useRouter();
const user = ref(null);

onMounted(() => {
  user.value = authService.getUser();
});

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>
