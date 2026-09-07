<template>
  <DosenLayout>
    <div class="space-y-6">

      <!-- Page Title -->
      <div class="text-left">
        <h1 class="text-headline-md text-on-surface mb-1">Dashboard Dosen</h1>
        <p class="text-body-sm text-on-surface-variant">Ringkasan aktivitas absensi dan kelas Anda hari ini.</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="alert-error text-left">
        <span class="mt-0.5 shrink-0">⚠️</span>
        <div class="flex-grow">
          <span class="font-bold">Gagal memuat data:</span> {{ errorMessage }}
        </div>
        <button @click="loadDashboardData" class="text-xs font-bold bg-error/10 hover:bg-error/20 px-2 py-1 rounded cursor-pointer shrink-0">
          Coba Lagi
        </button>
      </div>

      <!-- Statistics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Card 1: Total Courses -->
        <div class="card-level-1-hover p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <p class="text-label-sm text-on-surface-variant/70 uppercase tracking-wider">Mata Kuliah</p>
            <div class="absolute top-5 right-5 text-2xl opacity-30">📚</div>
          </div>
          <div class="mt-4">
            <span class="text-4xl font-semibold text-on-surface font-mono">
              {{ isLoading ? '—' : courses.length }}
            </span>
            <span class="text-body-sm text-on-surface-variant ml-2 block sm:inline">diampu semester ini</span>
          </div>
        </div>

        <!-- Card 2: Active Sessions -->
        <div class="card-level-1-hover p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <p class="text-label-sm text-on-surface-variant/70 uppercase tracking-wider">Sesi Kelas Aktif</p>
            <div class="absolute top-5 right-5 text-xl">
              <span class="w-3 h-3 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-4xl font-semibold text-on-surface font-mono">
              {{ isLoading ? '—' : activeSessions.length }}
            </span>
            <span class="text-body-sm text-on-surface-variant ml-2 block sm:inline">sedang aktif hari ini</span>
          </div>
        </div>
      </div>

      <!-- Active Sessions & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Active Sessions List -->
        <div class="card-level-1 p-6 lg:col-span-2 text-left">
          <h2 class="text-headline-sm text-on-surface mb-4">Sesi Aktif Hari Ini</h2>

          <!-- Loading Skeleton -->
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 2" :key="i" class="h-20 bg-surface-container rounded-lg animate-pulse"></div>
          </div>

          <!-- Data List -->
          <div v-else-if="activeSessions.length > 0" class="divide-y divide-outline-variant/20">
            <div
              v-for="session in activeSessions"
              :key="session.sesi_id"
              class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div>
                <h4 class="text-body-md font-semibold text-on-surface">{{ session.courseName }}</h4>
                <p class="text-label-sm text-on-surface-variant font-mono mt-0.5">{{ session.courseKode }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-label-sm font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    {{ formatTime(session.mulai) }} – {{ formatTime(session.selesai) }}
                  </span>
                  <span class="status-chip status-present">● Aktif</span>
                </div>
              </div>
              <router-link
                :to="`/dosen/sesi/${session.sesi_id}`"
                class="btn-primary text-xs py-2 px-4 w-fit sm:self-center"
              >
                Buka QR Code
              </router-link>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state py-10">
            <span class="text-3xl opacity-40 mb-2">💤</span>
            <p class="text-body-sm text-on-surface-variant/75 font-medium italic">Tidak ada sesi kelas aktif hari ini</p>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div class="card-level-1 p-6 text-left flex flex-col justify-between">
          <div>
            <h2 class="text-headline-sm text-on-surface mb-2">Navigasi Pintas</h2>
            <p class="text-body-sm text-on-surface-variant mb-6">Akses cepat ke pengaturan mata kuliah dan rekap absensi.</p>
          </div>
          <div class="space-y-3">
            <router-link
              to="/dosen/mata-kuliah"
              class="flex items-center justify-between p-3.5 border border-outline-variant/30 rounded text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:border-primary/20 transition-all"
            >
              <span>📚 Kelola Mata Kuliah</span>
              <span class="text-xs text-on-surface-variant/60">&rarr;</span>
            </router-link>
            <router-link
              to="/dosen/laporan"
              class="flex items-center justify-between p-3.5 border border-outline-variant/30 rounded text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:border-primary/20 transition-all"
            >
              <span>📝 Laporan Absensi</span>
              <span class="text-xs text-on-surface-variant/60">&rarr;</span>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </DosenLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DosenLayout from '../../components/DosenLayout.vue';
import authService from '../../services/auth';
import courseService from '../../services/course';

const courses = ref([]);
const activeSessions = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const loadDashboardData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const coursesData = await courseService.getCourses();
    courses.value = coursesData;

    const recapPromises = coursesData.map(async (course) => {
      try {
        const recap = await courseService.getCourseRecap(course.id);
        return recap.map(session => ({
          ...session,
          courseName: course.nama,
          courseKode: course.kode
        }));
      } catch (e) {
        console.error(`Failed to load recap for course ${course.id}:`, e);
        return [];
      }
    });

    const recaps = await Promise.all(recapPromises);
    const allSessions = recaps.flat();
    const todayStr = new Date().toDateString();

    activeSessions.value = allSessions.filter(session => {
      const isAktif = session.aktif;
      const isToday = new Date(session.mulai).toDateString() === todayStr;
      return isAktif && isToday;
    });
  } catch (error) {
    errorMessage.value = error;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB';
};
</script>
