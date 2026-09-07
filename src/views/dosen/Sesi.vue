<template>
  <DosenLayout>

    <!-- Error State -->
    <div v-if="pageError && !isLoading" class="card-level-1 p-8 text-center">
      <span class="text-4xl mb-4 block">⚠️</span>
      <h2 class="text-headline-sm text-on-surface mb-2">Gagal Memuat Sesi</h2>
      <p class="text-body-sm text-on-surface-variant mb-6">{{ pageError }}</p>
      <router-link to="/dosen/mata-kuliah" class="btn-primary">
        Kembali ke Mata Kuliah
      </router-link>
    </div>

    <!-- Loading Skeleton -->
    <div v-else-if="isLoading" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-2 card-level-1 p-8 animate-pulse">
        <div class="h-6 bg-surface-container-high rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-surface-container-high rounded w-1/3 mb-8"></div>
        <div class="w-48 h-48 bg-surface-container-high rounded mx-auto mb-6"></div>
        <div class="h-16 bg-surface-container-high rounded mb-4"></div>
        <div class="h-10 bg-surface-container-high rounded"></div>
      </div>
      <div class="lg:col-span-3 card-level-1 p-8 animate-pulse">
        <div class="h-6 bg-surface-container-high rounded w-1/3 mb-6"></div>
        <div class="h-10 bg-surface-container-high rounded mb-1"></div>
        <div class="h-14 bg-surface-container-high rounded mb-1"></div>
        <div class="h-14 bg-surface-container-high rounded"></div>
      </div>
    </div>

    <!-- Session Content -->
    <div v-else class="space-y-4">

      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-on-surface-variant">
        <router-link to="/dosen/mata-kuliah" class="hover:text-primary transition-colors">Mata Kuliah</router-link>
        <span>/</span>
        <span class="text-on-surface font-medium">Sesi Live</span>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        <!-- LEFT: QR Code Card -->
        <div class="lg:col-span-2 card-level-1 p-6 text-center">

          <!-- Course Info -->
          <div class="text-left mb-6 pb-4 border-b border-outline-variant/30">
            <h1 class="text-headline-sm text-on-surface mb-0.5">{{ courseName }}</h1>
            <p class="text-label-sm font-mono text-on-surface-variant">{{ courseKode }}</p>
            <div class="flex items-center gap-2 mt-3">
              <span v-if="sessionStatus === 'active'"   class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span v-else-if="sessionStatus === 'expired'" class="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span v-else class="w-2 h-2 bg-outline rounded-full"></span>
              <span
                class="text-label-sm font-semibold uppercase tracking-wider"
                :class="{
                  'text-emerald-600': sessionStatus === 'active',
                  'text-amber-600':   sessionStatus === 'expired',
                  'text-on-surface-variant': sessionStatus === 'closed'
                }"
              >{{ sessionStatusLabel }}</span>
            </div>
          </div>

          <!-- QR Display -->
          <div class="relative mb-6">
            <div v-if="sessionStatus === 'active' && qrDataUrl" class="flex flex-col items-center gap-3">
              <img :src="qrDataUrl" alt="QR Code Absensi" class="w-48 h-48 border-2 border-primary/20 rounded-lg shadow-xs" />
              <p class="text-body-sm text-on-surface-variant">Arahkan kamera mahasiswa ke QR ini</p>
            </div>
            <div v-else-if="sessionStatus === 'expired'" class="w-48 h-48 mx-auto bg-status-late-bg border-2 border-status-late-border rounded-lg flex flex-col items-center justify-center gap-2">
              <span class="text-4xl">⏰</span>
              <span class="text-xs font-semibold text-status-late text-center">Barcode<br/>Kedaluwarsa</span>
            </div>
            <div v-else class="w-48 h-48 mx-auto bg-surface-container-low border-2 border-outline-variant rounded-lg flex flex-col items-center justify-center gap-2">
              <span class="text-4xl">🔒</span>
              <span class="text-xs font-semibold text-on-surface-variant text-center">Sesi<br/>Ditutup</span>
            </div>
          </div>

          <!-- Countdown Timer -->
          <div v-if="sessionStatus !== 'closed'" class="bg-surface-container-low rounded-lg px-4 py-3 mb-5 text-center">
            <p class="text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Sisa Waktu Barcode</p>
            <div
              class="font-mono text-3xl font-bold tracking-tight"
              :class="{
                'text-on-surface': countdownSeconds > 120,
                'text-amber-600':  countdownSeconds > 0 && countdownSeconds <= 120,
                'text-error':      countdownSeconds <= 0
              }"
            >{{ formattedCountdown }}</div>
          </div>

          <!-- Close Session Button -->
          <button
            v-if="sessionStatus !== 'closed'"
            @click="handleCloseSession"
            :disabled="isClosing"
            class="btn-danger w-full flex items-center justify-center gap-2 py-2.5 cursor-pointer"
          >
            <span v-if="isClosing" class="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin"></span>
            <span v-else>🔒 Tutup Sesi</span>
          </button>

          <!-- Closed: back button -->
          <div v-else>
            <router-link to="/dosen/mata-kuliah" class="btn-primary w-full flex items-center justify-center">
              Buka Sesi Baru
            </router-link>
          </div>
        </div>

        <!-- RIGHT: Live Attendance -->
        <div class="lg:col-span-3 card-level-1 p-6">
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/30">
            <div class="text-left">
              <h2 class="text-headline-sm text-on-surface">Daftar Hadir Live</h2>
              <p class="text-label-sm text-on-surface-variant mt-0.5">
                Diperbarui setiap 3 detik &bull; {{ formatTime(sessionData?.mulai) }} – {{ formatTime(sessionData?.selesai) }}
              </p>
            </div>
            <span class="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full font-mono">
              {{ attendance.length }} hadir
            </span>
          </div>

          <!-- Polling Error -->
          <div v-if="pollingError" class="alert-warning text-xs mb-4">
            <span>⚠️</span>
            <span>Gagal memperbarui data: {{ pollingError }}</span>
          </div>

          <!-- Loading first fetch -->
          <div v-if="isLoadingAttendance" class="space-y-2">
            <div v-for="i in 3" :key="i" class="h-14 bg-surface-container rounded animate-pulse"></div>
          </div>

          <!-- Attendance Table -->
          <div v-else-if="attendance.length > 0" class="border border-outline-variant/30 rounded-lg overflow-hidden">
            <div class="overflow-x-auto max-h-[450px]">
              <table class="min-w-full divide-y divide-outline-variant/30 border-collapse text-left">
                <thead class="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                  <tr>
                    <th class="table-header-cell">#</th>
                    <th class="table-header-cell">Nama Mahasiswa</th>
                    <th class="table-header-cell">NIM</th>
                    <th class="table-header-cell">Waktu Hadir</th>
                    <th class="table-header-cell text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/20 bg-white">
                  <tr
                    v-for="(record, index) in attendance"
                    :key="record.id"
                    class="transition-colors hover:bg-surface-container-low/30"
                    :class="index % 2 === 1 ? 'bg-surface-container-low/10' : ''"
                  >
                    <td class="table-data-cell text-xs text-on-surface-variant font-mono">{{ index + 1 }}</td>
                    <td class="table-data-cell font-semibold">{{ record.nama }}</td>
                    <td class="table-data-cell text-xs font-mono text-on-surface-variant">{{ record.nim }}</td>
                    <td class="table-data-cell text-xs font-mono text-on-surface-variant">{{ formatTime(record.waktu_hadir) }}</td>
                    <td class="table-data-cell text-center">
                      <span class="status-chip status-present">Hadir</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state py-12">
            <span class="text-3xl opacity-40 mb-3">👥</span>
            <p class="text-body-sm text-on-surface-variant/75 font-medium">Belum ada mahasiswa yang absen</p>
            <p class="text-label-sm text-on-surface-variant/50 mt-1">Menunggu mahasiswa pindai QR Code...</p>
          </div>
        </div>

      </div>
    </div>
  </DosenLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import QRCode from 'qrcode';
import DosenLayout from '../../components/DosenLayout.vue';
import authService from '../../services/auth';
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
const courseName = ref('Memuat...');
const courseKode = ref('...');
const countdownSeconds = ref(0);

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

const loadSession = async () => {
  try {
    const barcodeData = await sessionService.getBarcode(sessionId);
    sessionData.value = barcodeData;

    if (barcodeData.barcode_token && !barcodeData.expired && barcodeData.aktif) {
      qrDataUrl.value = await QRCode.toDataURL(barcodeData.barcode_token, {
        width: 256, margin: 2,
        color: { dark: '#00685f', light: '#ffffff' }
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
