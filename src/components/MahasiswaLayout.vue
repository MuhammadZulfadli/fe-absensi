<template>
  <div class="min-h-screen bg-background flex flex-col font-sans">
    <!-- Header -->
    <AppHeader
      :user-name="user?.nama"
      :user-role="user?.role"
      :user-nip="user?.nim_nip"
      :show-hamburger="false"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <main class="flex-grow max-w-(--spacing-max-width) w-full mx-auto p-gutter">
      <!-- Tab Navigation -->
      <div class="flex gap-1 mb-6 bg-surface-container-low rounded-lg p-1 w-fit">
        <router-link
          to="/mahasiswa/scan"
          v-slot="{ isActive }"
          custom
        >
          <a
            href="/mahasiswa/scan"
            @click.prevent="router.push('/mahasiswa/scan')"
            class="px-4 py-2 rounded text-sm font-semibold transition-all"
            :class="isActive
              ? 'bg-white text-primary shadow-sm shadow-outline-variant/20'
              : 'text-on-surface-variant hover:text-on-surface'"
          >
            📷 Scan Barcode
          </a>
        </router-link>
        <router-link
          to="/mahasiswa/riwayat"
          v-slot="{ isActive }"
          custom
        >
          <a
            href="/mahasiswa/riwayat"
            @click.prevent="router.push('/mahasiswa/riwayat')"
            class="px-4 py-2 rounded text-sm font-semibold transition-all"
            :class="isActive
              ? 'bg-white text-primary shadow-sm shadow-outline-variant/20'
              : 'text-on-surface-variant hover:text-on-surface'"
          >
            📅 Riwayat Absensi
          </a>
        </router-link>
      </div>

      <!-- Slot for page content -->
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-outline-variant/30 py-4 text-center mt-auto">
      <p class="text-xs text-on-surface-variant/50">&copy; 2026 AttendSync. Hak Cipta Dilindungi.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from './AppHeader.vue';
import authService from '../services/auth';

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
