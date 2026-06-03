<template>
  <div class="min-h-screen bg-background flex flex-col font-sans">
    <!-- Top Header -->
    <header class="bg-white border-b border-outline-variant/30 px-6 py-4 sticky top-0 z-30">
      <div class="max-w-(--spacing-max-width) mx-auto flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-primary text-xl">⚡</span>
          <span class="font-semibold text-lg tracking-tight text-on-background">AttendSync<span class="text-primary font-normal">Web</span></span>
        </div>
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
          <router-link to="/dosen/dashboard" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">Dashboard</router-link>
          <router-link to="/dosen/mata-kuliah" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">Kelola Mata Kuliah</router-link>
          <router-link to="/dosen/laporan" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">Laporan Absensi</router-link>
        </nav>
        <div class="px-6 text-xs text-white/40">AttendSync Panel Dosen</div>
      </aside>

      <!-- Main Stage -->
      <main class="flex-grow p-gutter bg-[#f9fafb]">

        <!-- Error state -->
        <div v-if="pageError && !isLoading" class="bg-white border border-[#e5e7eb] rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-center">
          <span class="text-4xl mb-4 block">⚠️</span>
          <h2 class="text-lg font-bold text-on-surface mb-2">Gagal Memuat Sesi</h2>
          <p class="text-sm text-on-surface-variant mb-6">{{ pageError }}</p>
          <router-link to="/dosen/mata-kuliah" class="bg-primary text-white font-semibold text-sm py-2 px-5 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer">
            Kembali ke Mata Kuliah
          </router-link>
        </div>

        <!-- Loading skeleton -->
        <div v-else-if="isLoading" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div class="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] animate-pulse">
            <div class="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3 mb-8"></div>
            <div class="w-48 h-48 bg-slate-200 rounded mx-auto mb-6"></div>
            <div class="h-16 bg-slate-200 rounded mb-4"></div>
            <div class="h-10 bg-slate-200 rounded"></div>
          </div>
          <div class="lg:col-span-3 bg-white border border-[#e5e7eb] rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] animate-pulse">
            <div class="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div class="h-10 bg-slate-200 rounded mb-1"></div>
            <div class="h-14 bg-slate-200 rounded mb-1"></div>
            <div class="h-14 bg-slate-200 rounded"></div>
          </div>
        </div>

        <!-- Session Content -->
        <div v-else class="space-y-4">
          <!-- Back link & breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-on-surface-variant">
            <router-link to="/dosen/mata-kuliah" class="hover:text-primary transition-colors">Mata Kuliah</router-link>
            <span>/</span>
            <span class="text-on-surface font-medium">Sesi Live</span>
          </div>

          <!-- Main Grid: QR (left) | Attendance list (right) -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            <!-- LEFT: QR Code Card -->
            <div class="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-center">
              <!-- Course Info -->
              <div class="text-left mb-6 pb-4 border-b border-outline-variant/30">
                <h1 class="text-xl font-bold text-on-surface tracking-tight mb-0.5">{{ courseName }}</h1>
                <p class="text-xs font-mono text-on-surface-variant">{{ courseKode }}</p>
                <div class="flex items-center gap-2 mt-3">
                  <span v-if="sessionStatus === 'active'" class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span v-else-if="sessionStatus === 'expired'" class="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span v-else class="w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span class="text-xs font-semibold uppercase tracking-wider"
                    :class="sessionStatus === 'active' ? 'text-emerald-600' : sessionStatus === 'expired' ? 'text-amber-600' : 'text-slate-500'"
                  >{{ sessionStatusLabel }}</span>
                </div>
              </div>

              <!-- QR Code Display Area -->
              <div class="relative mb-6">
                <!-- Active QR -->
                <div v-if="sessionStatus === 'active' && qrDataUrl" class="flex flex-col items-center gap-3">
                  <img :src="qrDataUrl" alt="QR Code Absensi" class="w-48 h-48 border-2 border-primary/20 rounded-lg shadow-xs" />
                  <p class="text-xs text-on-surface-variant">Arahkan kamera mahasiswa ke QR ini</p>
                </div>
                <!-- Expired Overlay -->
                <div v-else-if="sessionStatus === 'expired'" class="w-48 h-48 mx-auto bg-amber-50 border-2 border-amber-200/70 rounded-lg flex flex-col items-center justify-center gap-2">
                  <span class="text-4xl">⏰</span>
                  <span class="text-xs font-semibold text-amber-700 text-center">Barcode<br/>Kedaluwarsa</span>
                </div>
                <!-- Closed Overlay -->
                <div v-else class="w-48 h-48 mx-auto bg-slate-100 border-2 border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2">
                  <span class="text-4xl">🔒</span>
                  <span class="text-xs font-semibold text-slate-600 text-center">Sesi<br/>Ditutup</span>
                </div>
              </div>

              <!-- Countdown Timer -->
              <div v-if="sessionStatus !== 'closed'" class="bg-surface-container-low rounded-lg px-4 py-3 mb-5 text-center">
                <p class="text-xs text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Sisa Waktu Barcode</p>
                <div class="font-mono text-3xl font-bold tracking-tight"
                  :class="countdownSeconds > 120 ? 'text-on-surface' : countdownSeconds > 0 ? 'text-amber-600' : 'text-error'"
                >
                  {{ formattedCountdown }}
                </div>
              </div>

              <!-- Close Session Button -->
              <button v-if="sessionStatus !== 'closed'" @click="handleCloseSession"
                :disabled="isClosing"
                class="w-full border border-error/30 text-error hover:bg-red-50 font-semibold text-sm py-2.5 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="isClosing" class="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin"></span>
                <span v-else>🔒 Tutup Sesi</span>
              </button>

              <!-- Re-open or back button when closed -->
              <div v-else class="space-y-2">
                <router-link to="/dosen/mata-kuliah" class="w-full block text-center bg-primary text-white font-semibold text-sm py-2.5 px-4 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer">
                  Buka Sesi Baru
                </router-link>
              </div>
            </div>

            <!-- RIGHT: Attendance Live List -->
            <div class="lg:col-span-3 bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <!-- Header with live indicator and count badge -->
              <div class="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/30">
                <div class="text-left">
                  <h2 class="text-lg font-bold text-on-surface">Daftar Hadir Live</h2>
                  <p class="text-xs text-on-surface-variant mt-0.5">Diperbarui setiap 3 detik &bull; {{ formatTime(sessionData?.mulai) }} – {{ formatTime(sessionData?.selesai) }}</p>
                </div>
                <span class="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full font-mono">
                  {{ attendance.length }} hadir
                </span>
              </div>

              <!-- Polling error inline -->
              <div v-if="pollingError" class="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded text-xs mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>Gagal memperbarui data: {{ pollingError }}</span>
              </div>

              <!-- Loading first fetch -->
              <div v-if="isLoadingAttendance" class="space-y-2">
                <div v-for="i in 3" :key="i" class="h-14 bg-slate-100 rounded animate-pulse"></div>
              </div>

              <!-- Attendance Table -->
              <div v-else-if="attendance.length > 0" class="border border-outline-variant/30 rounded-lg overflow-hidden">
                <div class="overflow-x-auto max-h-[450px]">
                  <table class="min-w-full divide-y divide-outline-variant/30 border-collapse text-left">
                    <thead class="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                      <tr>
                        <th class="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">#</th>
                        <th class="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Mahasiswa</th>
                        <th class="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIM</th>
                        <th class="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Waktu Hadir</th>
                        <th class="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-outline-variant/20 bg-white">
                      <tr
                        v-for="(record, index) in attendance"
                        :key="record.id"
                        class="transition-colors hover:bg-surface-container-low/30"
                        :class="index % 2 === 1 ? 'bg-surface-container-low/10' : ''"
                      >
                        <td class="px-4 py-3 text-xs text-on-surface-variant font-mono">{{ index + 1 }}</td>
                        <td class="px-4 py-3 text-sm font-semibold text-on-surface">{{ record.nama }}</td>
                        <td class="px-4 py-3 text-xs font-mono text-on-surface-variant">{{ record.nim }}</td>
                        <td class="px-4 py-3 text-xs font-mono text-on-surface-variant">{{ formatTime(record.waktu_hadir) }}</td>
                        <td class="px-4 py-3 text-center">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            Hadir
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="bg-[#f9fafb] border border-dashed border-[#e5e7eb] rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <span class="text-3xl opacity-40 mb-3">👥</span>
                <p class="text-xs text-on-surface-variant/75 font-medium">Belum ada mahasiswa yang absen</p>
                <p class="text-xs text-on-surface-variant/50 mt-1">Menunggu mahasiswa pindai QR Code...</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import QRCode from 'qrcode';
import authService from '../../services/auth';
import sessionService from '../../services/session';
import courseService from '../../services/course';

const router = useRouter();
const route = useRoute();
const sessionId = route.params.id;

const user = ref(null);
const isLoading = ref(true);
const isLoadingAttendance = ref(true);
const isClosing = ref(false);
const pageError = ref('');
const pollingError = ref('');

const sessionData = ref(null);
const qrDataUrl = ref('');
const attendance = ref([]);
const courseName = ref('Memuat...');
const courseKode = ref('...');
const countdownSeconds = ref(0);

let countdownInterval = null;
let pollingInterval = null;

// --- Computed States ---
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

// --- Data Loading ---
const loadSession = async () => {
  try {
    const barcodeData = await sessionService.getBarcode(sessionId);
    sessionData.value = barcodeData;

    // Generate QR Code image
    if (barcodeData.barcode_token && !barcodeData.expired && barcodeData.aktif) {
      qrDataUrl.value = await QRCode.toDataURL(barcodeData.barcode_token, {
        width: 256,
        margin: 2,
        color: { dark: '#00685f', light: '#ffffff' }
      });
    }

    // Compute initial countdown in seconds
    const expiredAt = new Date(barcodeData.barcode_expired_at);
    const now = new Date();
    const diff = Math.floor((expiredAt - now) / 1000);
    countdownSeconds.value = Math.max(0, diff);

    // Start countdown ticker
    startCountdown();

    // Load course name
    try {
      const courses = await courseService.getCourses();
      const course = courses.find(c => c.id === barcodeData.mata_kuliah_id);
      if (course) {
        courseName.value = course.nama;
        courseKode.value = course.kode;
      } else {
        courseName.value = 'Mata Kuliah Tidak Diketahui';
        courseKode.value = '-';
      }
    } catch (e) {
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
    if (countdownSeconds.value > 0) {
      countdownSeconds.value--;
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

const startPolling = () => {
  fetchAttendance(); // fetch immediately on mount
  pollingInterval = setInterval(() => {
    // Only poll if session is still active or expired (not manually closed)
    if (sessionData.value?.aktif) {
      fetchAttendance();
    }
  }, 3000);
};

// --- Actions ---
const handleCloseSession = async () => {
  isClosing.value = true;
  try {
    await sessionService.closeSession(sessionId);
    // Update local state immediately
    if (sessionData.value) {
      sessionData.value.aktif = false;
    }
    clearInterval(pollingInterval); // stop live polling when closed
  } catch (error) {
    pageError.value = error;
  } finally {
    isClosing.value = false;
  }
};

// --- Lifecycle ---
onMounted(() => {
  user.value = authService.getUser();
  loadSession().then(() => {
    startPolling();
  });
});

onUnmounted(() => {
  clearInterval(countdownInterval);
  clearInterval(pollingInterval);
});

// --- Helpers ---
const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>
