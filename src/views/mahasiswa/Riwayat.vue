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
            <div class="text-xs text-on-surface-variant">Mahasiswa &bull; {{ user?.nim_nip }}</div>
          </div>
          <button @click="handleLogout" class="border border-outline/30 text-on-surface-variant hover:bg-surface-container-low font-medium text-xs py-2 px-4 rounded transition-colors cursor-pointer">
            Keluar
          </button>
        </div>
      </div>
    </header>

    <!-- Content Stage -->
    <main class="flex-grow max-w-(--spacing-max-width) w-full mx-auto p-gutter my-6">
      <!-- Container Card (Level 1 Surface) -->
      <div class="bg-white border border-outline-variant/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-lg p-6 md:p-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-6 mb-6">
          <div class="text-left">
            <h1 class="text-2xl font-bold text-on-surface tracking-tight mb-1">Riwayat Absensi</h1>
            <p class="text-sm text-on-surface-variant">Daftar kehadiran kelas Anda yang telah terekam di sistem.</p>
          </div>
          
          <router-link to="/mahasiswa/scan" class="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-xs py-2.5 px-4 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer w-fit self-start sm:self-center">
            <span>📷</span> Mulai Scan Absensi
          </router-link>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded flex items-start gap-2.5 text-sm mb-6 text-left">
          <span class="mt-0.5">⚠️</span>
          <span class="flex-grow font-medium">{{ errorMessage }}</span>
          <button @click="fetchHistory" class="text-xs font-bold bg-error/10 hover:bg-error/20 px-2 py-1 rounded cursor-pointer">Coba Lagi</button>
        </div>

        <!-- Loading State (Table Skeleton) -->
        <div v-if="isLoading" class="border border-outline-variant/30 rounded-lg overflow-hidden">
          <div class="bg-surface-container-low h-10 w-full animate-pulse border-b border-outline-variant/30"></div>
          <div class="divide-y divide-outline-variant/20 bg-white">
            <div v-for="i in 3" :key="i" class="p-6 flex items-center justify-between animate-pulse">
              <div class="space-y-2 w-1/3">
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div class="h-4 bg-slate-200 rounded w-1/4"></div>
              <div class="h-6 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        <!-- Data Table (Zebra, Sticky Header, Dense padding) -->
        <div v-else-if="history.length > 0" class="border border-outline-variant/30 rounded-lg overflow-hidden">
          <div class="overflow-x-auto max-h-[500px]">
            <table class="min-w-full divide-y divide-outline-variant/30 text-left border-collapse">
              <thead class="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mata Kuliah</th>
                  <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Waktu Kehadiran</th>
                  <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/20 bg-white">
                <tr 
                  v-for="(row, index) in history" 
                  :key="row.id" 
                  class="transition-colors hover:bg-surface-container-low/30"
                  :class="index % 2 === 1 ? 'bg-surface-container-low/10' : ''"
                >
                  <!-- Course Info -->
                  <td class="px-6 py-3">
                    <div class="font-semibold text-on-surface text-sm">{{ row.mata_kuliah_nama }}</div>
                    <div class="text-xs text-on-surface-variant font-mono mt-0.5">{{ row.mata_kuliah_kode }}</div>
                  </td>
                  
                  <!-- Attendance Time (Numeric figures in font-mono) -->
                  <td class="px-6 py-3">
                    <div class="text-on-surface text-sm">{{ formatDate(row.waktu_hadir) }}</div>
                    <div class="text-xs text-on-surface-variant font-mono mt-0.5">{{ formatTime(row.waktu_hadir) }}</div>
                  </td>
                  
                  <!-- Status Chip -->
                  <td class="px-6 py-3 text-center">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                      :class="row.status === 'hadir' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'"
                    >
                      {{ row.status === 'hadir' ? 'Hadir' : row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-16 flex flex-col items-center justify-center text-center">
          <span class="text-5xl mb-4">📅</span>
          <h3 class="text-base font-bold text-on-surface mb-1">Belum Ada Riwayat Absensi</h3>
          <p class="text-sm text-on-surface-variant max-w-sm mb-6">Anda belum pernah mencatat kehadiran kelas. Silakan scan QR Code sesi untuk mulai.</p>
          <router-link to="/mahasiswa/scan" class="bg-primary text-white font-semibold text-xs py-2 px-5 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer">
            Pindai QR Sekarang
          </router-link>
        </div>

        <!-- Tab Links -->
        <div class="flex justify-center gap-6 border-t border-outline-variant/30 pt-6 mt-8">
          <router-link to="/mahasiswa/scan" class="text-sm font-medium text-on-surface-variant hover:text-primary pb-2 px-1 transition-colors">Scan Barcode</router-link>
          <router-link to="/mahasiswa/riwayat" class="text-sm font-semibold text-primary border-b-2 border-primary pb-2 px-1">Riwayat Absensi</router-link>
        </div>
      </div>
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
import authService from '../../services/auth';
import attendanceService from '../../services/attendance';

const router = useRouter();
const user = ref(null);

const isLoading = ref(true);
const history = ref([]);
const errorMessage = ref('');

const fetchHistory = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const data = await attendanceService.getMyAttendance();
    history.value = data;
  } catch (error) {
    errorMessage.value = error;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  user.value = authService.getUser();
  fetchHistory();
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB';
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>
