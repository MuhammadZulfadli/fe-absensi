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
          <router-link to="/dosen/dashboard" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-primary bg-white/10 text-white">
            Dashboard
          </router-link>
          <router-link to="/dosen/mata-kuliah" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">
            Kelola Mata Kuliah
          </router-link>
          <router-link to="/dosen/laporan" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">
            Laporan Absensi
          </router-link>
        </nav>
        <div class="px-6 text-xs text-white/40">
          AttendSync Panel Dosen
        </div>
      </aside>

      <!-- Main Stage -->
      <main class="flex-grow p-gutter bg-[#f9fafb]">
        <div class="space-y-6">
          
          <!-- Header Title -->
          <div class="text-left">
            <h1 class="text-2xl font-bold tracking-tight text-on-surface mb-1">Dashboard Dosen</h1>
            <p class="text-sm text-on-surface-variant">Ringkasan aktivitas absensi dan kelas Anda hari ini.</p>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded flex items-start gap-2.5 text-sm text-left">
            <span class="mt-0.5">⚠️</span>
            <div class="flex-grow">
              <span class="font-bold">Gagal memuat data:</span> {{ errorMessage }}
            </div>
            <button @click="loadDashboardData" class="text-xs font-bold bg-error/10 hover:bg-error/20 px-2 py-1 rounded cursor-pointer">Coba Lagi</button>
          </div>

          <!-- Statistics Cards Grid (Level 1 Surfaces, Minimalist style) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Card 1: Total Courses -->
            <div class="bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
              <div>
                <p class="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider">Mata Kuliah</p>
                <div class="absolute top-5 right-5 text-2xl opacity-40">📚</div>
              </div>
              <div class="mt-4">
                <span class="text-4xl font-semibold text-on-surface font-mono">{{ isLoading ? '...' : courses.length }}</span>
                <span class="text-xs text-on-surface-variant/80 ml-2 block sm:inline">diampu semester ini</span>
              </div>
            </div>

            <!-- Card 2: Active Sessions Today -->
            <div class="bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
              <div>
                <p class="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider font-sans">Sesi Kelas Aktif</p>
                <div class="absolute top-5 right-5 text-2xl">🟢</div>
              </div>
              <div class="mt-4">
                <span class="text-4xl font-semibold text-on-surface font-mono">{{ isLoading ? '...' : activeSessions.length }}</span>
                <span class="text-xs text-on-surface-variant/80 ml-2 block sm:inline">sedang aktif hari ini</span>
              </div>
            </div>
          </div>

          <!-- Active Sessions & Quick Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Active Sessions List (Left Col, spans 2 on large screens) -->
            <div class="bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:col-span-2 text-left">
              <h2 class="text-lg font-bold text-on-surface mb-4">Sesi Aktif Hari Ini</h2>
              
              <!-- Loading State -->
              <div v-if="isLoading" class="space-y-3">
                <div v-for="i in 2" :key="i" class="h-20 bg-slate-100 rounded animate-pulse"></div>
              </div>

              <!-- Data List -->
              <div v-else-if="activeSessions.length > 0" class="divide-y divide-[#e5e7eb]">
                <div v-for="session in activeSessions" :key="session.sesi_id" class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 class="font-semibold text-on-surface text-sm sm:text-base">{{ session.courseName }}</h4>
                    <p class="text-xs text-on-surface-variant/70 font-mono mt-0.5">{{ session.courseKode }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                        {{ formatTime(session.mulai) }} - {{ formatTime(session.selesai) }}
                      </span>
                      <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span class="text-xs text-emerald-600 font-semibold uppercase">Aktif</span>
                    </div>
                  </div>
                  
                  <router-link 
                    :to="`/dosen/sesi/${session.sesi_id}`" 
                    class="inline-flex items-center justify-center bg-primary text-white font-semibold text-xs py-2 px-4 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer w-fit sm:self-center"
                  >
                    Buka QR Code
                  </router-link>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="bg-[#f9fafb] border border-dashed border-[#e5e7eb] rounded-lg p-10 flex flex-col items-center justify-center text-center">
                <span class="text-3xl opacity-40 mb-2">💤</span>
                <p class="text-xs text-on-surface-variant/75 font-medium italic">Tidak ada sesi kelas aktif hari ini</p>
              </div>
            </div>

            <!-- Quick Navigation Shortcuts (Right Col) -->
            <div class="bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left flex flex-col justify-between">
              <div>
                <h2 class="text-lg font-bold text-on-surface mb-2">Navigasi Pintas</h2>
                <p class="text-xs text-on-surface-variant mb-6">Akses cepat ke pengaturan mata kuliah dan rekap absensi.</p>
              </div>

              <div class="space-y-3">
                <router-link 
                  to="/dosen/mata-kuliah" 
                  class="flex items-center justify-between p-3.5 border border-[#e5e7eb] rounded text-sm font-semibold text-on-surface hover:bg-surface-container-low hover:border-primary/20 transition-all"
                >
                  <span>📚 Kelola Mata Kuliah</span>
                  <span class="text-xs text-on-surface-variant/60">&rarr;</span>
                </router-link>
                
                <router-link 
                  to="/dosen/laporan" 
                  class="flex items-center justify-between p-3.5 border border-[#e5e7eb] rounded text-sm font-semibold text-on-surface hover:bg-surface-container-low hover:border-primary/20 transition-all"
                >
                  <span>📝 Laporan Absensi</span>
                  <span class="text-xs text-on-surface-variant/60">&rarr;</span>
                </router-link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/auth';
import courseService from '../../services/course';

const router = useRouter();
const user = ref(null);

const courses = ref([]);
const activeSessions = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const loadDashboardData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    // 1. Fetch courses
    const coursesData = await courseService.getCourses();
    courses.value = coursesData;
    
    // 2. Fetch recaps in parallel
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
    
    // 3. Filter active sessions scheduled for today
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
  user.value = authService.getUser();
  loadDashboardData();
});

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB';
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>
