<template>
  <DosenLayout>
    <div class="space-y-6 text-left">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Laporan & Rekapitulasi Presensi</h1>
          <p class="text-xs sm:text-sm text-slate-500">Lihat histori seluruh sesi perkuliahan dan ringkasan kehadiran mahasiswa.</p>
        </div>
        <button
          v-if="selectedCourseId && recapList.length > 0"
          @click="handlePrint"
          class="btn-secondary text-xs sm:text-sm py-2 px-3.5 self-start sm:self-center flex items-center gap-1.5"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Cetak Laporan</span>
        </button>
      </div>

      <!-- Error Alert -->
      <Transition name="fade">
        <div v-if="pageError" class="alert-error">
          <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-grow text-xs sm:text-sm">
            <span class="font-bold">Error:</span> {{ pageError }}
          </div>
          <button @click="loadCourses" class="text-xs font-bold bg-rose-200/50 hover:bg-rose-200 px-2.5 py-1 rounded-lg text-rose-800 cursor-pointer">
            Coba Lagi
          </button>
        </div>
      </Transition>

      <!-- Course Selection Card -->
      <div class="card-level-1 p-5 sm:p-6 bg-gradient-to-br from-white to-slate-50/50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Pilih Mata Kuliah</label>
            <p class="text-xs text-slate-400">Pilih salah satu kelas untuk menampilkan rincian rekapitulasi.</p>
          </div>
          <div class="w-full sm:w-72">
            <select
              v-model="selectedCourseId"
              @change="fetchRecap"
              :disabled="isLoadingCourses || courses.length === 0"
              class="input-modern font-medium text-xs sm:text-sm bg-white"
            >
              <option :value="null" disabled>-- Pilih Mata Kuliah --</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.kode }} - {{ course.nama }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Recap Content -->
      <div v-if="selectedCourseId" class="space-y-6">

        <!-- KPI Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Total Sessions -->
          <div class="card-level-1 p-5 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sesi Perkuliahan</p>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                {{ recapList.length }}
              </h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Active Sessions -->
          <div class="card-level-1 p-5 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Sesi Berjalan</p>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-mono">
                {{ activeSessionsCount }}
              </h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <!-- Closed Sessions -->
          <div class="card-level-1 p-5 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Sesi Selesai</p>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-700 mt-1 font-mono">
                {{ recapList.length - activeSessionsCount }}
              </h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="card-level-1 overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900">Histori Sesi Perkuliahan</h2>
              <p class="text-xs text-slate-500">Daftar waktu mulai, berakhir, dan status pelaksanaan sesi.</p>
            </div>
          </div>

          <div v-if="isLoadingRecap" class="p-8 space-y-3">
            <div v-for="i in 3" :key="i" class="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
          </div>

          <div v-else-if="recapList.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 border-collapse">
              <thead>
                <tr>
                  <th class="table-header-cell text-left">Sesi Ke</th>
                  <th class="table-header-cell text-left">Waktu Mulai</th>
                  <th class="table-header-cell text-left">Waktu Selesai</th>
                  <th class="table-header-cell text-center">Status</th>
                  <th class="table-header-cell text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr v-for="(session, index) in recapList" :key="session.sesi_id || index" class="hover:bg-slate-50/80 transition-colors">
                  <td class="table-data-cell font-mono font-bold text-blue-700">
                    #{{ recapList.length - index }}
                  </td>
                  <td class="table-data-cell font-mono text-xs text-slate-700">
                    {{ formatDateTime(session.mulai) }}
                  </td>
                  <td class="table-data-cell font-mono text-xs text-slate-700">
                    {{ session.selesai ? formatDateTime(session.selesai) : '—' }}
                  </td>
                  <td class="table-data-cell text-center">
                    <span v-if="session.aktif" class="status-chip status-present text-xs">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sedang Aktif
                    </span>
                    <span v-else class="status-chip status-closed text-xs">
                      Selesai
                    </span>
                  </td>
                  <td class="table-data-cell text-center">
                    <router-link
                      :to="`/dosen/sesi/${session.sesi_id}`"
                      class="btn-secondary text-xs py-1.5 px-3"
                    >
                      Buka Detail Sesi
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state py-12">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mb-1">Belum Ada Riwayat Sesi</h4>
            <p class="text-xs text-slate-400">Mata kuliah ini belum pernah membuka sesi presensi.</p>
          </div>
        </div>

      </div>

      <!-- Empty State if no course selected -->
      <div v-else class="empty-state py-16">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800 mb-1">Silakan Pilih Mata Kuliah</h3>
        <p class="text-xs text-slate-400 max-w-sm">
          Pilih mata kuliah dari menu di atas untuk menampilkan ringkasan data laporan presensi.
        </p>
      </div>

    </div>
  </DosenLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DosenLayout from '../../components/DosenLayout.vue';
import courseService from '../../services/course';

const courses = ref([]);
const selectedCourseId = ref(null);
const recapList = ref([]);
const isLoadingCourses = ref(true);
const isLoadingRecap = ref(false);
const pageError = ref('');

const activeSessionsCount = computed(() => {
  return recapList.value.filter(s => s.aktif).length;
});

const loadCourses = async () => {
  isLoadingCourses.value = true;
  pageError.value = '';
  try {
    const data = await courseService.getCourses();
    courses.value = data;
    if (data.length > 0) {
      selectedCourseId.value = data[0].id;
      await fetchRecap();
    }
  } catch (error) {
    pageError.value = error;
  } finally {
    isLoadingCourses.value = false;
  }
};

const fetchRecap = async () => {
  if (!selectedCourseId.value) return;
  isLoadingRecap.value = true;
  try {
    const data = await courseService.getCourseRecap(selectedCourseId.value);
    recapList.value = data;
  } catch (error) {
    pageError.value = error;
  } finally {
    isLoadingRecap.value = false;
  }
};

onMounted(() => {
  loadCourses();
});

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB';
};

const handlePrint = () => {
  window.print();
};
</script>
