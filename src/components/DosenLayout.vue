<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Header -->
    <AppHeader
      :user-name="user?.nama"
      :user-role="user?.role"
      :user-nip="user?.nim_nip"
      :show-hamburger="true"
      @logout="handleLogout"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />

    <!-- Layout Body -->
    <div class="flex flex-grow w-full mx-auto">
      <!-- Mobile Backdrop Overlay -->
      <Transition name="fade">
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          @click="isSidebarOpen = false"
        />
      </Transition>

      <!-- Sidebar -->
      <aside
        class="fixed md:sticky top-0 md:top-[61px] inset-y-0 left-0 z-50 md:z-20 w-[270px] bg-slate-900 text-slate-300 flex flex-col justify-between py-6 px-4 shrink-0 h-screen md:h-[calc(100vh-61px)] border-r border-slate-800/80 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out"
        :class="
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        "
      >
        <div class="space-y-6">
          <!-- Mobile Sidebar Header -->
          <div
            class="flex items-center justify-between px-2 md:hidden pb-3 border-b border-slate-800"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs"
              >
                AS
              </div>
              <span class="font-bold text-white text-base">Menu Navigasi</span>
            </div>
            <button
              @click="isSidebarOpen = false"
              class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Section Label -->
          <div class="px-3">
            <p
              class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              Menu Utama
            </p>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1.5 w-full">
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
                class="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
                :class="
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                "
              >
                <!-- SVG Icons -->
                <div
                  class="shrink-0 transition-transform group-hover:scale-110"
                  :class="
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-blue-400'
                  "
                >
                  <!-- Dashboard -->
                  <svg
                    v-if="item.icon === 'dashboard'"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <!-- Mata Kuliah -->
                  <svg
                    v-else-if="item.icon === 'course'"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <!-- Laporan -->
                  <svg
                    v-else-if="item.icon === 'report'"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span>{{ item.label }}</span>
              </a>
            </router-link>
          </nav>
        </div>

        <!-- Sidebar Footer Info -->
        <div class="px-3 pt-4 border-t border-slate-800">
          <div
            class="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex items-center gap-3"
          >
            <div
              class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"
            ></div>
            <div class="text-[11px] text-slate-400 leading-tight">
              <span class="font-semibold text-slate-200 block"
                >Sistem Online</span
              >
              Server presensi siap digunakan
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-grow p-4 sm:p-6 lg:p-8 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "./AppHeader.vue";
import authService from "../services/auth";

const router = useRouter();
const user = ref(null);
const isSidebarOpen = ref(false);

const navItems = [
  { to: "/dosen/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/dosen/mata-kuliah", icon: "course", label: "Kelola Mata Kuliah" },
  { to: "/dosen/laporan", icon: "report", label: "Laporan Absensi" },
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
  router.push("/login");
};
</script>
