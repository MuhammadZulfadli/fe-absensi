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
    <main class="flex-grow max-w-(--spacing-max-width) w-full mx-auto p-gutter flex flex-col items-center justify-center my-6">
      <div class="bg-white border border-outline-variant/30 shadow-xs rounded-lg p-8 w-full max-w-lg text-center">
        <h1 class="text-xl font-bold text-on-surface mb-2 tracking-tight">Pindai Barcode Absensi</h1>
        <p class="text-sm text-on-surface-variant mb-8 max-w-md mx-auto">Silakan arahkan kamera perangkat Anda ke QR Code yang ditampilkan oleh Dosen di depan kelas.</p>
        
        <!-- Feedback Alerts -->
        <div class="space-y-4 mb-6 text-left">
          <!-- Camera Error -->
          <div v-if="cameraError" class="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded flex items-start gap-2.5 text-sm">
            <span class="mt-0.5">⚠️</span>
            <div class="flex-grow">
              <span class="font-bold">Gagal mengakses kamera:</span> {{ cameraError }}
            </div>
          </div>

          <!-- API Success -->
          <div v-if="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded flex items-start gap-2.5 text-sm">
            <span class="mt-0.5">✅</span>
            <div class="flex-grow">
              <span class="font-bold">Berhasil!</span> {{ successMessage }}
            </div>
          </div>

          <!-- API Error -->
          <div v-if="apiError" class="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded flex items-start gap-2.5 text-sm">
            <span class="mt-0.5">❌</span>
            <div class="flex-grow">
              <span class="font-bold">Gagal mencatat absensi:</span> {{ apiError }}
            </div>
          </div>
        </div>

        <!-- Scanner Area -->
        <div class="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-8 mb-8 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
          
          <!-- Scanning Active -->
          <div v-if="isScanning && !cameraError" class="relative w-56 h-56 mx-auto bg-black rounded-lg overflow-hidden shadow-xs">
            <qrcode-stream @detect="onDetect" @error="onCameraError" />
            
            <!-- Target Corners -->
            <span class="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl z-10"></span>
            <span class="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr z-10"></span>
            <span class="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl z-10"></span>
            <span class="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br z-10"></span>
            
            <!-- Laser scanning line -->
            <div class="absolute left-2 right-2 h-0.5 bg-error shadow-[0_0_8px_var(--color-error)] animate-bounce z-10"></div>
          </div>

          <!-- Scanning Paused (Loading or Success/Error screen) -->
          <div v-else class="flex flex-col items-center justify-center p-6 text-center">
            <div v-if="isLoading" class="flex flex-col items-center gap-3">
              <span class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
              <p class="text-sm font-medium text-on-surface-variant">Memproses absensi Anda...</p>
            </div>
            <div v-else-if="successMessage || apiError || cameraError" class="flex flex-col items-center gap-4">
              <span class="text-5xl">{{ successMessage ? '🎉' : '❌' }}</span>
              <button @click="resetScanner" class="bg-primary text-white font-semibold text-sm py-2 px-5 rounded hover:bg-primary-container transition-all shadow-sm cursor-pointer">
                Pindai Lagi
              </button>
            </div>
            <div v-else class="flex flex-col items-center gap-3">
              <span class="text-4xl opacity-40">📷</span>
              <p class="text-xs text-on-surface-variant/75 font-medium">Kamera tidak aktif</p>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs/Links -->
        <div class="flex justify-center gap-6 border-t border-outline-variant/30 pt-6">
          <router-link to="/mahasiswa/scan" class="text-sm font-semibold text-primary border-b-2 border-primary pb-2 px-1">Scan Barcode</router-link>
          <router-link to="/mahasiswa/riwayat" class="text-sm font-medium text-on-surface-variant hover:text-primary pb-2 px-1 transition-colors">Riwayat Absensi</router-link>
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
import { QrcodeStream } from 'vue-qrcode-reader';
import authService from '../../services/auth';
import attendanceService from '../../services/attendance';

const router = useRouter();
const user = ref(null);

const isScanning = ref(true);
const isLoading = ref(false);
const cameraError = ref('');
const successMessage = ref('');
const apiError = ref('');

onMounted(() => {
  user.value = authService.getUser();
});

const onDetect = async (detectedCodes) => {
  // Grab the first code
  const code = detectedCodes[0];
  if (!code || !code.rawValue) return;

  const barcodeToken = code.rawValue;
  
  // Pause scanning and start loading
  isScanning.value = false;
  isLoading.value = true;
  successMessage.value = '';
  apiError.value = '';

  try {
    const result = await attendanceService.recordAttendance(barcodeToken);
    successMessage.value = result.message || 'Kehadiran berhasil dicatat.';
  } catch (error) {
    apiError.value = error;
  } finally {
    isLoading.value = false;
  }
};

const onCameraError = (error) => {
  console.error('Camera error:', error);
  if (error.name === 'NotAllowedError') {
    cameraError.value = 'Izin kamera ditolak. Silakan berikan izin kamera di browser Anda untuk memindai.';
  } else if (error.name === 'NotFoundError') {
    cameraError.value = 'Tidak ada kamera yang terdeteksi pada perangkat ini.';
  } else if (error.name === 'NotSupportedError') {
    cameraError.value = 'Browser Anda tidak mendukung pemindaian kamera di luar HTTPS/localhost.';
  } else if (error.name === 'NotReadableError') {
    cameraError.value = 'Kamera sedang digunakan oleh tab atau aplikasi lain.';
  } else if (error.name === 'OverconstrainedError') {
    cameraError.value = 'Spesifikasi kamera tidak mendukung pengaturan yang diminta.';
  } else {
    cameraError.value = error.message || 'Gagal memulai kamera.';
  }
};

const resetScanner = () => {
  isScanning.value = true;
  successMessage.value = '';
  apiError.value = '';
  cameraError.value = '';
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>
