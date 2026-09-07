<template>
  <MahasiswaLayout>
    <div class="card-level-1 p-8 w-full max-w-lg mx-auto text-center">
      <h1 class="text-headline-sm text-on-surface mb-2">Pindai Barcode Absensi</h1>
      <p class="text-body-sm text-on-surface-variant mb-8 max-w-md mx-auto">
        Silakan arahkan kamera perangkat Anda ke QR Code yang ditampilkan oleh Dosen di depan kelas.
      </p>

      <!-- Feedback Alerts -->
      <div class="space-y-3 mb-6 text-left">
        <Transition name="fade">
          <div v-if="cameraError" class="alert-error">
            <span class="mt-0.5 shrink-0">⚠️</span>
            <div class="flex-grow">
              <span class="font-bold">Gagal mengakses kamera:</span> {{ cameraError }}
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="successMessage" class="alert-success">
            <span class="mt-0.5 shrink-0">✅</span>
            <div class="flex-grow">
              <span class="font-bold">Berhasil!</span> {{ successMessage }}
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="apiError" class="alert-error">
            <span class="mt-0.5 shrink-0">❌</span>
            <div class="flex-grow">
              <span class="font-bold">Gagal mencatat absensi:</span> {{ apiError }}
            </div>
          </div>
        </Transition>
      </div>

      <!-- Scanner Area -->
      <div class="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-8 mb-6 relative overflow-hidden min-h-[300px] flex flex-col justify-center">

        <!-- Camera Active -->
        <div v-if="isScanning && !cameraError" class="relative w-56 h-56 mx-auto bg-black rounded-lg overflow-hidden shadow-xs">
          <qrcode-stream @detect="onDetect" @error="onCameraError" />
          <!-- Corner Markers -->
          <span class="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-primary rounded-tl z-10"></span>
          <span class="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-primary rounded-tr z-10"></span>
          <span class="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-primary rounded-bl z-10"></span>
          <span class="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-primary rounded-br z-10"></span>
          <!-- Laser line -->
          <div class="absolute left-2 right-2 h-0.5 bg-error shadow-[0_0_8px_var(--color-error)] animate-bounce z-10"></div>
        </div>

        <!-- Paused State -->
        <div v-else class="flex flex-col items-center justify-center p-6 text-center">
          <div v-if="isLoading" class="flex flex-col items-center gap-3">
            <span class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
            <p class="text-body-sm font-medium text-on-surface-variant">Memproses absensi Anda...</p>
          </div>
          <div v-else-if="successMessage || apiError || cameraError" class="flex flex-col items-center gap-4">
            <span class="text-5xl">{{ successMessage ? '🎉' : '❌' }}</span>
            <button @click="resetScanner" class="btn-primary text-sm py-2 px-5 cursor-pointer">
              Pindai Lagi
            </button>
          </div>
          <div v-else class="flex flex-col items-center gap-3">
            <span class="text-4xl opacity-40">📷</span>
            <p class="text-label-sm text-on-surface-variant/75 font-medium">Kamera tidak aktif</p>
          </div>
        </div>

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

const onDetect = async (detectedCodes) => {
  const code = detectedCodes[0];
  if (!code || !code.rawValue) return;

  isScanning.value = false;
  isLoading.value = true;
  successMessage.value = '';
  apiError.value = '';

  try {
    const result = await attendanceService.recordAttendance(code.rawValue);
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
    NotAllowedError: 'Izin kamera ditolak. Silakan berikan izin kamera di browser Anda untuk memindai.',
    NotFoundError: 'Tidak ada kamera yang terdeteksi pada perangkat ini.',
    NotSupportedError: 'Browser Anda tidak mendukung pemindaian kamera di luar HTTPS/localhost.',
    NotReadableError: 'Kamera sedang digunakan oleh tab atau aplikasi lain.',
    OverconstrainedError: 'Spesifikasi kamera tidak mendukung pengaturan yang diminta.',
  };
  cameraError.value = messages[error.name] ?? (error.message || 'Gagal memulai kamera.');
};

const resetScanner = () => {
  isScanning.value = true;
  successMessage.value = '';
  apiError.value = '';
  cameraError.value = '';
};
</script>
