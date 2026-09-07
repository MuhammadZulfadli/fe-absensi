<template>
  <header
    class="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 sticky top-0 z-30 transition-all"
  >
    <div class="mx-auto flex justify-between items-center">
      <!-- Brand & Mobile Hamburger -->
      <div class="flex items-center gap-3">
        <!-- Hamburger (mobile only) -->
        <button
          v-if="showHamburger"
          @click="$emit('toggle-sidebar')"
          class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Brand Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2.5 text-decoration-none group"
        >
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span
                class="font-bold text-lg tracking-tight text-slate-900 leading-none"
                >Attend<span class="text-blue-600">Sync</span></span
              >
              <span
                class="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded"
                >Pro</span
              >
            </div>
          </div>
        </router-link>
      </div>

      <!-- User Info & Logout Button -->
      <div class="flex items-center gap-3 sm:gap-5">
        <div v-if="userName" class="flex items-center gap-3">
          <!-- Avatar Initial Circle -->
          <div
            class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-100"
          >
            {{ userInitials }}
          </div>

          <!-- User Details (Desktop) -->
          <div class="hidden sm:flex flex-col text-left">
            <div class="font-semibold text-sm text-slate-900 leading-tight">
              {{ userName }}
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[11px] font-medium text-slate-500">{{
                userRoleLabel
              }}</span>
              <span class="text-slate-300">&bull;</span>
              <span class="text-[11px] font-mono text-slate-500">{{
                userNip
              }}</span>
            </div>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          @click="$emit('logout')"
          class="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 group cursor-pointer hover:border-red-200 hover:bg-red-50/50 hover:text-red-600 transition-colors"
          title="Keluar dari akun"
        >
          <svg
            class="w-4 h-4 text-slate-500 group-hover:text-red-600 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  userName: { type: String, default: "" },
  userRole: { type: String, default: "" },
  userNip: { type: String, default: "" },
  showHamburger: { type: Boolean, default: false },
});

defineEmits(["logout", "toggle-sidebar"]);

const userRoleLabel = computed(() => {
  const map = { dosen: "Dosen Pengampu", mahasiswa: "Mahasiswa" };
  return map[props.userRole] ?? props.userRole;
});

const userInitials = computed(() => {
  if (!props.userName) return "U";
  const parts = props.userName.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
});
</script>
