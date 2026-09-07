<template>
  <MahasiswaLayout>
    <div class="card-level-1 p-6 md:p-8 text-left">

      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-6 mb-6">
        <div>
          <h1 class="text-headline-md text-on-surface mb-1">Riwayat Absensi</h1>
          <p class="text-body-sm text-on-surface-variant">Daftar kehadiran kelas Anda yang telah terekam di sistem.</p>
        </div>
        <router-link to="/mahasiswa/scan" class="btn-primary text-xs py-2.5 px-4 w-fit self-start sm:self-center">
          📷 Mulai Scan Absensi
        </router-link>
      </div>

      <!-- Error Alert -->
      <Transition name="fade">
        <div v-if="errorMessage" class="alert-error mb-6">
          <span class="mt-0.5 shrink-0">⚠️</span>
          <span class="flex-grow font-medium">{{ errorMessage }}</span>
          <button @click="fetchHistory"
            class="text-xs font-bold bg-error/10 hover:bg-error/20 px-2 py-1 rounded cursor-pointer shrink-0">
            Coba Lagi
          </button>
        </div>
      </Transition>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="border border-outline-variant/30 rounded-lg overflow-hidden">
        <div class="bg-surface-container-low h-10 w-full animate-pulse border-b border-outline-variant/30"></div>
        <div class="divide-y divide-outline-variant/20 bg-white">
          <div v-for="i in 3" :key="i" class="p-6 flex items-center justify-between animate-pulse">
            <div class="space-y-2 w-1/3">
              <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-surface-container-high rounded w-1/4"></div>
            <div class="h-6 bg-surface-container-high rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else-if="history.length > 0" class="border border-outline-variant/30 rounded-lg overflow-hidden">
        <div class="overflow-x-auto max-h-[500px]">
          <table class="min-w-full divide-y divide-outline-variant/30 text-left border-collapse">
            <thead class="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
              <tr>
                <th class="table-header-cell">Mata Kuliah</th>
                <th class="table-header-cell">Waktu Kehadiran</th>
                <th class="table-header-cell text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20 bg-white">
              <tr v-for="(row, index) in history" :key="row.id"
                class="transition-colors hover:bg-surface-container-low/30"
                :class="index % 2 === 1 ? 'bg-surface-container-low/10' : ''">
                <!-- Course -->
                <td class="table-data-cell">
                  <div class="font-semibold text-on-surface">{{ row.mata_kuliah_nama }}</div>
                  <div class="text-xs text-on-surface-variant font-mono mt-0.5">{{ row.mata_kuliah_kode }}</div>
                </td>
                <!-- Time (numeric figures) -->
                <td class="table-data-cell">
                  <div class="text-on-surface">{{ formatDate(row.waktu_hadir) }}</div>
                  <div class="text-xs text-on-surface-variant font-mono mt-0.5">{{ formatTime(row.waktu_hadir) }}</div>
                </td>
                <!-- Status Chip -->
                <td class="table-data-cell text-center">
                  <span class="status-chip" :class="{
                    'status-present': row.status === 'hadir',
                    'status-late': row.status === 'terlambat',
                    'status-absent': row.status === 'absen',
                    'status-closed': !['hadir', 'terlambat', 'absen'].includes(row.status)
                  }">
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
        <span class="text-5xl mb-4">📅</span>
        <h3 class="text-body-md font-bold text-on-surface mb-1">Belum Ada Riwayat Absensi</h3>
        <p class="text-body-sm text-on-surface-variant max-w-sm mb-6">
          Anda belum pernah mencatat kehadiran kelas. Silakan scan QR Code sesi untuk mulai.
        </p>
        <router-link to="/mahasiswa/scan" class="btn-primary text-xs py-2 px-5">
          Pindai QR Sekarang
        </router-link>
      </div>

    </div>
  </MahasiswaLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MahasiswaLayout from '../../components/MahasiswaLayout.vue';
import attendanceService from '../../services/attendance';

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

onMounted(() => fetchHistory());

const statusLabel = (status) => {
  const map = { hadir: 'Hadir', terlambat: 'Terlambat', absen: 'Absen' };
  return map[status] ?? status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB';
};
</script>