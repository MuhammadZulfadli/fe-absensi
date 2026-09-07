<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Header -->
    <AppHeader
      :user-name="user?.nama"
      :user-role="user?.role"
      :user-nip="user?.nim_nip"
      :show-hamburger="false"
      @logout="handleLogout"
    />

    <!-- Main Content Container -->
    <main class="flex-grow w-full mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Modern Segmented Pill Tabs -->
      <div
        class="flex items-center gap-1.5 mb-8 bg-slate-200/70 p-1.5 rounded-2xl w-fit border border-slate-300/50 shadow-xs"
      >
        <router-link to="/mahasiswa/scan" v-slot="{ isActive }" custom>
          <a
            href="/mahasiswa/scan"
            @click.prevent="router.push('/mahasiswa/scan')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="
              isActive
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            "
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <span>Pindai Barcode</span>
          </a>
        </router-link>

        <router-link to="/mahasiswa/riwayat" v-slot="{ isActive }" custom>
          <a
            href="/mahasiswa/riwayat"
            @click.prevent="router.push('/mahasiswa/riwayat')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="
              isActive
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            "
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>Riwayat Absensi</span>
          </a>
        </router-link>
      </div>

      <!-- Page Content Slot -->
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="bg-white/60 border-t border-slate-200 py-4 text-center mt-auto"
    >
      <div
        class="max-w-(--spacing-max-width) mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400"
      >
        <p>&copy; 2026 AttendSync Pro. Hak Cipta Dilindungi.</p>
        <p class="font-medium text-slate-500">
          Portal Mahasiswa &bull; Presensi Digital
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "./AppHeader.vue";
import authService from "../services/auth";

const router = useRouter();
const user = ref(null);

onMounted(() => {
  user.value = authService.getUser();
});

const handleLogout = () => {
  authService.logout();
  router.push("/login");
};
</script>
