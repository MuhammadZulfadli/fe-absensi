<template>
  <MahasiswaLayout>
    <div class="space-y-6 text-left">
      
      <!-- Page Header & Action -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Presensi Mahasiswa</h1>
          <p class="text-xs sm:text-sm text-slate-500">Daftar kehadiran seluruh perkuliahan yang telah terekam di sistem.</p>
        </div>
        <router-link
          to="/mahasiswa/scan"
          class="btn-primary py-2.5 px-4 self-start sm:self-center text-xs sm:text-sm shadow-md shadow-blue-500/20"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span>Pindai Barcode Sesi</span>
        </router-link>
      </div>

      <!-- Error Alert -->
      <Transition name="fade">
        <div v-if="errorMessage" class="alert-error">
          <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-grow text-xs sm:text-sm font-medium">{{ errorMessage }}</span>
          <button @click="fetchHistory" class="text-xs font-bold bg-rose-200/50 hover:bg-rose-200 px-2.5 py-1 rounded-lg text-rose-800 cursor-pointer">
            Coba Lagi
          </button>
        </div>
      </Transition>

      <!-- Statistics KPI Cards -->
      <div v-if="!isLoading && history.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <!-- Hadir -->
        <div class="card-level-1 p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hadir</p>
            <h4 class="text-xl font-extrabold text-emerald-600 font-mono">{{ countHadir }}</h4>
          </div>
        </div>

        <!-- Terlambat -->
        <div class="card-level-1 p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Terlambat</p>
            <h4 class="text-xl font-extrabold text-amber-600 font-mono">{{ countTerlambat }}</h4>
          </div>
        </div>

        <!-- Absen -->
        <div class="card-level-1 p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tidak Hadir</p>
            <h4 class="text-xl font-extrabold text-rose-600 font-mono">{{ countAbsen }}</h4>
          </div>
        </div>

        <!-- Total -->
        <div class="card-level-1 p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Sesi</p>
            <h4 class="text-xl font-extrabold text-slate-800 font-mono">{{ history.length }}</h4>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div v-if="history.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative w-full sm:w-80">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari mata kuliah atau kode..."
            class="input-modern pl-10 text-xs sm:text-sm py-2"
          />
        </div>

        <!-- Status Filter Tabs -->
        <div class="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            @click="activeStatusFilter = tab.value"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            :class="activeStatusFilter === tab.value
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="card-level-1 overflow-hidden">
        <div class="bg-slate-100 h-11 w-full animate-pulse border-b border-slate-200"></div>
        <div class="divide-y divide-slate-100 bg-white">
          <div v-for="i in 4" :key="i" class="p-5 flex items-center justify-between animate-pulse">
            <div class="space-y-2 w-1/3">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-slate-200 rounded w-1/4"></div>
            <div class="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div v-else-if="filteredHistory.length > 0" class="card-level-1 overflow-hidden">
        <div class="overflow-x-auto max-h-[520px]">
          <table class="min-w-full divide-y divide-slate-200 border-collapse">
            <thead class="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th class="table-header-cell text-left">Mata Kuliah</th>
                <th class="table-header-cell text-left">Tanggal & Hari</th>
                <th class="table-header-cell text-left">Waktu Masuk</th>
                <th class="table-header-cell text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr
                v-for="(row, index) in filteredHistory"
                :key="row.id || index"
                class="hover:bg-slate-50/80 transition-colors"
                :class="index % 2 === 1 ? 'bg-slate-50/30' : ''"
              >
                <!-- Course -->
                <td class="table-data-cell font-bold text-slate-800">
                  <div>{{ row.mata_kuliah_nama }}</div>
                  <span class="text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                    {{ row.mata_kuliah_kode }}
                  </span>
                </td>

                <!-- Date -->
                <td class="table-data-cell text-xs font-medium text-slate-700">
                  {{ formatDate(row.waktu_hadir) }}
                </td>

                <!-- Time -->
                <td class="table-data-cell font-mono text-xs text-slate-600">
                  {{ formatTime(row.waktu_hadir) }}
                </td>

                <!-- Status Chip -->
                <td class="table-data-cell text-center">
                  <span class="status-chip text-xs" :class="{
                    'status-present': row.status === 'hadir',
                    'status-late':    row.status === 'terlambat',
                    'status-absent':  row.status === 'absen',
                    'status-closed':  !['hadir', 'terlambat', 'absen'].includes(row.status)
                  }">
                    <span v-if="row.status === 'hadir'">✓</span>
                    <span v-else-if="row.status === 'terlambat'">⏰</span>
                    <span v-else-if="row.status === 'absen'">✕</span>
                    {{ statusLabel(row.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state py-16">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800 mb-1">
          {{ searchQuery || activeStatusFilter !== 'all' ? 'Tidak Ada Data yang Cocok' : 'Belum Ada Riwayat Presensi' }}
        </h3>
        <p class="text-xs text-slate-400 max-w-sm mb-6">
          {{ searchQuery || activeStatusFilter !== 'all'
            ? 'Coba ganti kata kunci pencarian atau filter status yang dipilih.'
            : 'Anda belum pernah mencatat presensi di kelas manapun. Pindai kode barcode untuk mulai.' }}
        </p>
        <router-link
          v-if="!searchQuery && activeStatusFilter === 'all'"
          to="/mahasiswa/scan"
          class="btn-primary text-xs py-2 px-4 shadow-sm"
        >
          Pindai Barcode Sekarang &rarr;
        </router-link>
        <button
          v-else
          @click="resetFilters"
          class="btn-secondary text-xs py-2 px-4"
        >
          Reset Filter
        </button>
      </div>

    </div>
  </MahasiswaLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MahasiswaLayout from '../../components/MahasiswaLayout.vue';
import attendanceService from '../../services/attendance';

const isLoading = ref(true);
const history = ref([]);
const errorMessage = ref('');
const searchQuery = ref('');
const activeStatusFilter = ref('all');

const filterTabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Hadir', value: 'hadir' },
  { label: 'Terlambat', value: 'terlambat' },
  { label: 'Tidak Hadir', value: 'absen' },
];

const countHadir = computed(() => history.value.filter(h => h.status === 'hadir').length);
const countTerlambat = computed(() => history.value.filter(h => h.status === 'terlambat').length);
const countAbsen = computed(() => history.value.filter(h => h.status === 'absen').length);

const filteredHistory = computed(() => {
  let list = history.value;
  if (activeStatusFilter.value !== 'all') {
    list = list.filter(h => h.status === activeStatusFilter.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(h =>
      (h.mata_kuliah_nama && h.mata_kuliah_nama.toLowerCase().includes(q)) ||
      (h.mata_kuliah_kode && h.mata_kuliah_kode.toLowerCase().includes(q))
    );
  }
  return list;
});

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

onMounted(() => fetchHistory());

const resetFilters = () => {
  searchQuery.value = '';
  activeStatusFilter.value = 'all';
};

const statusLabel = (status) => {
  const map = { hadir: 'Hadir', terlambat: 'Terlambat', absen: 'Tidak Hadir' };
  return map[status] ?? status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB';
};
</script>