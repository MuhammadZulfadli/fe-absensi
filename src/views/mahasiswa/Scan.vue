<template>
  <MahasiswaLayout>
    <div class="card-level-1 p-6 sm:p-8 w-full max-w-lg mx-auto text-center space-y-6">
      
      <!-- Card Title & Instructions -->
      <div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Pindai Barcode Presensi</h1>
        <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
          Arahkan kamera HP/laptop Anda tepat ke layar proyektor dosen untuk mencatat kehadiran.
        </p>
      </div>

      <!-- Feedback Alerts -->
      <div class="space-y-3 text-left">
        <!-- Camera Error -->
        <Transition name="fade">
          <div v-if="cameraError" class="alert-warning text-xs">
            <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="flex-grow">
              <span class="font-bold">Izin Kamera:</span> {{ cameraError }}
            </div>
          </div>
        </Transition>

        <!-- Success Alert -->
        <Transition name="fade">
          <div v-if="successMessage" class="alert-success text-xs sm:text-sm">
            <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-grow">
              <span class="font-bold">Presensi Berhasil:</span> {{ successMessage }}
            </div>
          </div>
        </Transition>

        <!-- API / Validation Error -->
        <Transition name="fade">
          <div v-if="apiError" class="alert-error text-xs sm:text-sm">
            <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-grow">
              <span class="font-bold">Gagal Presensi:</span> {{ apiError }}
            </div>
          </div>
        </Transition>
      </div>

      <!-- Scanner Box -->
      <div class="bg-slate-900 rounded-2xl p-6 relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center shadow-lg shadow-slate-900/10">
        
        <!-- Live Camera Mode -->
        <div v-if="isScanning && !cameraError && !manualMode" class="relative w-64 h-64 mx-auto bg-black rounded-xl overflow-hidden shadow-inner">
          <qrcode-stream @detect="onDetect" @error="onCameraError" class="w-full h-full object-cover" />
          
          <!-- Corner Focus Markers -->
          <span class="absolute top-2 left-2 w-7 h-7 border-t-4 border-l-4 border-blue-500 rounded-tl-md z-10"></span>
          <span class="absolute top-2 right-2 w-7 h-7 border-t-4 border-r-4 border-blue-500 rounded-tr-md z-10"></span>
          <span class="absolute bottom-2 left-2 w-7 h-7 border-b-4 border-l-4 border-blue-500 rounded-bl-md z-10"></span>
          <span class="absolute bottom-2 right-2 w-7 h-7 border-b-4 border-r-4 border-blue-500 rounded-br-md z-10"></span>
          
          <!-- Scanning Laser Beam -->
          <div class="absolute left-3 right-3 h-0.5 bg-blue-400 shadow-[0_0_12px_#38bdf8] animate-scan-laser z-10 pointer-events-none"></div>
        </div>

        <!-- Manual Token Entry Mode -->
        <div v-else-if="manualMode" class="w-full max-w-xs space-y-4 text-white text-left">
          <div class="text-center">
            <h3 class="text-sm font-bold text-slate-200">Input Token Manual</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Masukkan token string barcode dari dosen</p>
          </div>
          <input
            type="text"
            v-model="manualToken"
            placeholder="Contoh: eyJhbGciOi..."
            class="input-modern text-xs font-mono py-2 text-slate-900"
            :disabled="isLoading"
          />
          <button
            @click="handleManualSubmit"
            :disabled="isLoading || !manualToken.trim()"
            class="btn-primary w-full py-2.5 text-xs font-bold"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Kirim Presensi</span>
          </button>
        </div>

        <!-- Paused / Result State -->
        <div v-else class="flex flex-col items-center justify-center p-4 text-center text-white">
          <div v-if="isLoading" class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-sm font-medium text-slate-300">Memverifikasi kode presensi Anda...</p>
          </div>
          <div v-else-if="successMessage" class="flex flex-col items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-sm font-bold text-white">Presensi Anda Telah Terekam!</p>
            <div class="flex items-center gap-2 mt-2">
              <button @click="resetScanner" class="btn-primary text-xs py-2 px-4 shadow-sm">
                Pindai Lagi
              </button>
              <router-link to="/mahasiswa/riwayat" class="btn-secondary text-xs py-2 px-4">
                Lihat Riwayat &rarr;
              </router-link>
            </div>
          </div>
          <div v-else-if="apiError || cameraError" class="flex flex-col items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p class="text-xs text-slate-300">Presensi gagal atau kamera terhambat</p>
            <button @click="resetScanner" class="btn-primary text-xs py-2 px-4 mt-2">
              Coba Pindai Ulang
            </button>
          </div>
        </div>

      </div>

      <!-- Mode Switcher Helper -->
      <div class="pt-2 border-t border-slate-100 flex items-center justify-center">
        <button
          @click="toggleMode"
          class="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          <span>{{ manualMode ? 'Gunakan Pemindai Kamera' : 'Kamera bermasalah? Masukkan Token Manual' }}</span>
        </button>
      </div>

    </div>
  </MahasiswaLayout>
</template>

<script setup>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import MahasiswaLayout from '../../components/MahasiswaLayout.vue';
import attendanceService from '../../services/attendance';

const isScanning = ref(true);
const isLoading = ref(false);
const cameraError = ref('');
const successMessage = ref('');
const apiError = ref('');
const manualMode = ref(false);
const manualToken = ref('');

const onDetect = async (detectedCodes) => {
  const code = detectedCodes[0];
  if (!code || !code.rawValue) return;

  submitToken(code.rawValue);
};

const handleManualSubmit = () => {
  if (!manualToken.value.trim()) return;
  submitToken(manualToken.value.trim());
};

const submitToken = async (token) => {
  isScanning.value = false;
  isLoading.value = true;
  successMessage.value = '';
  apiError.value = '';

  try {
    const result = await attendanceService.recordAttendance(token);
    successMessage.value = result.message || 'Kehadiran berhasil dicatat.';
  } catch (error) {
    apiError.value = error;
  } finally {
    isLoading.value = false;
  }
};

const onCameraError = (error) => {
  console.error('Camera error:', error);
  const messages = {
    NotAllowedError: 'Izin kamera ditolak. Berikan izin akses kamera di browser Anda.',
    NotFoundError: 'Tidak ada modul kamera yang terdeteksi di perangkat ini.',
    NotSupportedError: 'Browser memerlukan koneksi HTTPS atau localhost untuk mengaktifkan kamera.',
    NotReadableError: 'Kamera sedang digunakan oleh aplikasi lain.',
    OverconstrainedError: 'Resolusi kamera tidak mendukung.',
  };
  cameraError.value = messages[error.name] ?? (error.message || 'Gagal memulai kamera.');
};

const toggleMode = () => {
  manualMode.value = !manualMode.value;
  resetScanner();
};

const resetScanner = () => {
  isScanning.value = true;
  successMessage.value = '';
  apiError.value = '';
  cameraError.value = '';
  manualToken.value = '';
};
</script>
