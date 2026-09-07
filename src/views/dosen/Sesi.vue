<template>
  <DosenLayout>
    <!-- Error State -->
    <div v-if="pageError && !isLoading" class="card-level-1 p-8 text-center max-w-lg mx-auto">
      <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-1">Gagal Memuat Sesi</h2>
      <p class="text-xs sm:text-sm text-slate-500 mb-6">{{ pageError }}</p>
      <router-link to="/dosen/mata-kuliah" class="btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm">
        Kembali ke Mata Kuliah
      </router-link>
    </div>

    <!-- Loading Skeleton -->
    <div v-else-if="isLoading" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-2 card-level-1 p-6 animate-pulse space-y-4">
        <div class="h-6 bg-slate-200 rounded w-2/3"></div>
        <div class="h-4 bg-slate-100 rounded w-1/3"></div>
        <div class="w-48 h-48 bg-slate-200 rounded-2xl mx-auto my-6"></div>
        <div class="h-14 bg-slate-100 rounded-xl"></div>
        <div class="h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div class="lg:col-span-3 card-level-1 p-6 animate-pulse space-y-4">
        <div class="h-6 bg-slate-200 rounded w-1/3"></div>
        <div class="h-10 bg-slate-100 rounded-xl"></div>
        <div class="h-16 bg-slate-100 rounded-xl"></div>
        <div class="h-16 bg-slate-100 rounded-xl"></div>
      </div>
    </div>

    <!-- Session Content -->
    <div v-else class="space-y-4 text-left">

      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <router-link to="/dosen/mata-kuliah" class="hover:text-blue-600 font-medium transition-colors">
            Mata Kuliah
          </router-link>
          <span>/</span>
          <span class="text-slate-900 font-bold">Sesi Presensi Live</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="sessionStatus === 'active' && qrDataUrl"
            @click="showProjectorModal = true"
            class="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-blue-700 bg-blue-50/60 border-blue-200 hover:bg-blue-100 cursor-pointer"
            title="Tampilkan layar penuh untuk proyektor"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Mode Proyektor</span>
          </button>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        <!-- LEFT: QR Code Card -->
        <div class="lg:col-span-2 card-level-1 p-6 text-center space-y-5">
          
          <!-- Course Info Header -->
          <div class="text-left pb-4 border-b border-slate-100">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-mono font-bold bg-blue-50 border border-blue-200/80 text-blue-700 px-2.5 py-0.5 rounded-full">
                {{ courseKode }}
              </span>
              <span
                class="status-chip text-xs"
                :class="{
                  'status-present': sessionStatus === 'active',
                  'status-late':    sessionStatus === 'expired',
                  'status-closed':  sessionStatus === 'closed'
                }"
              >
                <span v-if="sessionStatus === 'active'" class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ sessionStatusLabel }}
              </span>
            </div>
            <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">{{ courseName }}</h1>
          </div>

          <!-- QR Code Display Box -->
          <div class="flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 relative">
            <div v-if="sessionStatus === 'active' && qrDataUrl" class="flex flex-col items-center gap-3">
              <div class="p-3 bg-white rounded-2xl border border-blue-200/80 shadow-md shadow-blue-500/10 transition-transform hover:scale-[1.02]">
                <img :src="qrDataUrl" alt="QR Code Absensi" class="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
              </div>
              <p class="text-xs text-slate-500 font-medium">Arahkan kamera mahasiswa ke kode barcode ini</p>
            </div>

            <div v-else-if="sessionStatus === 'expired'" class="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center gap-2 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300">
              <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-xs font-bold text-amber-700 text-center">Waktu Barcode Habis</span>
              <span class="text-[11px] text-amber-600/80 text-center">Sesi kelas telah kedaluwarsa</span>
            </div>

            <div v-else class="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center gap-2 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
              <div class="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span class="text-xs font-bold text-slate-700 text-center">Sesi Ditutup</span>
              <span class="text-[11px] text-slate-500 text-center">Presensi tidak lagi menerima input</span>
            </div>
          </div>

          <!-- Countdown Timer -->
          <div v-if="sessionStatus !== 'closed'" class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span class="font-bold uppercase tracking-wider">Sisa Waktu Barcode</span>
              <span v-if="countdownSeconds > 0" class="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Berjalan
              </span>
            </div>
            <div
              class="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider"
              :class="{
                'text-white': countdownSeconds > 120,
                'text-amber-400': countdownSeconds > 0 && countdownSeconds <= 120,
                'text-rose-400': countdownSeconds <= 0
              }"
            >
              {{ formattedCountdown }}
            </div>
          </div>

          <!-- Action Button: Close Session or Back -->
          <div class="pt-2">
            <button
              v-if="sessionStatus !== 'closed'"
              @click="handleCloseSession"
              :disabled="isClosing"
              class="btn-danger w-full py-2.5 shadow-xs font-bold flex items-center justify-center gap-2 cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
            >
              <span v-if="isClosing" class="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></span>
              <span v-else class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tutup Sesi Sekarang</span>
              </span>
            </button>
            <router-link
              v-else
              to="/dosen/mata-kuliah"
              class="btn-primary w-full py-2.5 shadow-sm flex items-center justify-center gap-2"
            >
              <span>Kembali ke Daftar Mata Kuliah</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>

        </div>

        <!-- RIGHT: Live Attendance Feed -->
        <div class="lg:col-span-3 card-level-1 p-6 space-y-4">
          
          <!-- Attendance Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-bold text-slate-900">Daftar Kehadiran Mahasiswa</h2>
                <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono">
                  {{ attendance.length }} Hadir
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Auto-refresh setiap 3 detik &bull; {{ formatTime(sessionData?.mulai) }} – {{ formatTime(sessionData?.selesai) }}</span>
              </p>
            </div>
          </div>

          <!-- Search in Attendance -->
          <div v-if="attendance.length > 0" class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              v-model="attendanceSearch"
              placeholder="Cari mahasiswa yang sudah absen..."
              class="input-modern pl-9 text-xs py-1.5"
            />
          </div>

          <!-- Polling Error -->
          <div v-if="pollingError" class="alert-warning text-xs">
            <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Gagal memperbarui data live: {{ pollingError }}</span>
          </div>

          <!-- First fetch skeleton -->
          <div v-if="isLoadingAttendance" class="space-y-2">
            <div v-for="i in 3" :key="i" class="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>

          <!-- Attendance Table -->
          <div v-else-if="filteredAttendance.length > 0" class="border border-slate-200/80 rounded-xl overflow-hidden">
            <div class="overflow-x-auto max-h-[480px]">
              <table class="min-w-full divide-y divide-slate-200 border-collapse">
                <thead class="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th class="table-header-cell text-left">Mahasiswa</th>
                    <th class="table-header-cell text-left">NIM</th>
                    <th class="table-header-cell text-left">Waktu Masuk</th>
                    <th class="table-header-cell text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr
                    v-for="(record, index) in filteredAttendance"
                    :key="record.id || index"
                    class="hover:bg-slate-50/80 transition-colors"
                  >
                    <!-- Student with Avatar Initial -->
                    <td class="table-data-cell font-bold text-slate-800">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {{ record.nama ? record.nama.slice(0, 2).toUpperCase() : 'M' }}
                        </div>
                        <span class="truncate max-w-[180px] sm:max-w-none">{{ record.nama }}</span>
                      </div>
                    </td>

                    <!-- NIM -->
                    <td class="table-data-cell font-mono text-xs text-slate-600">
                      {{ record.nim }}
                    </td>

                    <!-- Time -->
                    <td class="table-data-cell text-xs font-mono text-slate-500">
                      {{ formatTime(record.waktu_hadir) }}
                    </td>

                    <!-- Status -->
                    <td class="table-data-cell text-center">
                      <span class="status-chip status-present text-[11px]">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Hadir
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state py-14">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mb-1">
              {{ attendanceSearch ? 'Mahasiswa Tidak Ditemukan' : 'Belum Ada Mahasiswa Hadir' }}
            </h4>
            <p class="text-xs text-slate-400 max-w-sm">
              {{ attendanceSearch ? 'Coba cari dengan kata kunci nama atau NIM yang lain.' : 'Menunggu mahasiswa memindai kode barcode di kelas...' }}
            </p>
          </div>

        </div>

      </div>
    </div>

    <!-- ── Projector / Fullscreen Modal ───────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showProjectorModal" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6">
          <button
            @click="showProjectorModal = false"
            class="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="text-center max-w-lg w-full space-y-5 animate-slide-up">
            <span class="text-xs font-mono font-bold bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full">
              {{ courseKode }} &bull; {{ courseName }}
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pindai Barcode Presensi Kelas
            </h2>
            
            <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl inline-block mx-auto">
              <img :src="qrDataUrl" alt="QR Code" class="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto" />
            </div>

            <div class="flex items-center justify-center gap-3">
              <div class="bg-slate-900 border border-slate-700/80 px-4 py-2 rounded-xl text-white font-mono text-lg font-bold">
                ⏱️ {{ formattedCountdown }}
              </div>
              <div class="bg-emerald-950 border border-emerald-800/80 px-4 py-2 rounded-xl text-emerald-300 font-mono text-sm font-bold">
                👥 {{ attendance.length }} Mahasiswa Hadir
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </DosenLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import QRCode from 'qrcode';
import DosenLayout from '../../components/DosenLayout.vue';
import sessionService from '../../services/session';
import courseService from '../../services/course';

const router = useRouter();
const route = useRoute();
const sessionId = route.params.id;

const isLoading = ref(true);
const isLoadingAttendance = ref(true);
const isClosing = ref(false);
const pageError = ref('');
const pollingError = ref('');

const sessionData = ref(null);
const qrDataUrl = ref('');
const attendance = ref([]);
const attendanceSearch = ref('');
const courseName = ref('Memuat...');
const courseKode = ref('...');
const countdownSeconds = ref(0);
const showProjectorModal = ref(false);

let countdownInterval = null;
let pollingInterval = null;

const sessionStatus = computed(() => {
  if (!sessionData.value?.aktif) return 'closed';
  if (countdownSeconds.value <= 0) return 'expired';
  return 'active';
});

const sessionStatusLabel = computed(() => {
  const map = { active: 'Aktif & Memindai', expired: 'Barcode Expired', closed: 'Sesi Ditutup' };
  return map[sessionStatus.value];
});

const formattedCountdown = computed(() => {
  if (countdownSeconds.value <= 0) return '00:00';
  const m = Math.floor(countdownSeconds.value / 60);
  const s = countdownSeconds.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

const filteredAttendance = computed(() => {
  if (!attendanceSearch.value.trim()) return attendance.value;
  const q = attendanceSearch.value.toLowerCase().trim();
  return attendance.value.filter(a =>
    (a.nama && a.nama.toLowerCase().includes(q)) ||
    (a.nim && a.nim.toLowerCase().includes(q))
  );
});

const loadSession = async () => {
  try {
    const barcodeData = await sessionService.getBarcode(sessionId);
    sessionData.value = barcodeData;

    if (barcodeData.barcode_token && !barcodeData.expired && barcodeData.aktif) {
      qrDataUrl.value = await QRCode.toDataURL(barcodeData.barcode_token, {
        width: 320,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    }

    const expiredAt = new Date(barcodeData.barcode_expired_at);
    countdownSeconds.value = Math.max(0, Math.floor((expiredAt - new Date()) / 1000));
    startCountdown();

    try {
      const courses = await courseService.getCourses();
      const course = courses.find(c => c.id === barcodeData.mata_kuliah_id);
      courseName.value = course?.nama ?? 'Mata Kuliah Tidak Diketahui';
      courseKode.value = course?.kode ?? '-';
    } catch {
      courseName.value = 'Error Memuat Kelas';
    }
  } catch (error) {
    pageError.value = error;
  } finally {
    isLoading.value = false;
  }
};

const fetchAttendance = async () => {
  pollingError.value = '';
  try {
    const data = await sessionService.getSessionAttendance(sessionId);
    attendance.value = data;
  } catch (error) {
    pollingError.value = error;
  } finally {
    isLoadingAttendance.value = false;
  }
};

const startCountdown = () => {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (countdownSeconds.value > 0) countdownSeconds.value--;
    else clearInterval(countdownInterval);
  }, 1000);
};

const startPolling = () => {
  fetchAttendance();
  pollingInterval = setInterval(() => {
    if (sessionData.value?.aktif) fetchAttendance();
  }, 3000);
};

const handleCloseSession = async () => {
  isClosing.value = true;
  try {
    await sessionService.closeSession(sessionId);
    if (sessionData.value) sessionData.value.aktif = false;
    clearInterval(pollingInterval);
    showProjectorModal.value = false;
  } catch (error) {
    pageError.value = error;
  } finally {
    isClosing.value = false;
  }
};

onMounted(() => {
  loadSession().then(() => startPolling());
});

onUnmounted(() => {
  clearInterval(countdownInterval);
  clearInterval(pollingInterval);
});

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
};
</script>
