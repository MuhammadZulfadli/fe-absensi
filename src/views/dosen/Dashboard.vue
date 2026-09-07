<template>
  <DosenLayout>
    <div class="space-y-6 text-left">
      <!-- Hero Welcome Banner -->
      <div
        class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/15 relative overflow-hidden"
      >
        <div
          class="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"
        ></div>
        <div
          class="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span
                class="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-xs"
              >
                {{ currentDateFormatted }}
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              Dashboard Dosen
            </h1>
            <p class="text-blue-100 text-sm max-w-xl">
              Pantau jalannya kelas perkuliahan, buka sesi absensi barcode
              real-time, dan periksa rekapitulasi kehadiran mahasiswa.
            </p>
          </div>
          <div class="shrink-0">
            <router-link
              to="/dosen/mata-kuliah"
              class="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Buka Sesi Kelas</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <Transition name="fade">
        <div v-if="errorMessage" class="alert-error">
          <svg
            class="w-5 h-5 text-rose-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="flex-grow text-sm">
            <span class="font-bold">Gagal memuat data:</span> {{ errorMessage }}
          </div>
          <button
            @click="loadDashboardData"
            class="text-xs font-bold bg-rose-200/50 hover:bg-rose-200 px-2.5 py-1 rounded-lg text-rose-800 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </Transition>

      <!-- KPI Statistics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Card 1: Total Courses -->
        <div class="card-level-1-hover p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <div>
              <p
                class="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Total Mata Kuliah
              </p>
              <h3 class="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                {{ isLoading ? "—" : courses.length }}
              </h3>
            </div>
            <div
              class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <div
            class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
          >
            <span>Mata kuliah aktif semester ini</span>
            <router-link
              to="/dosen/mata-kuliah"
              class="text-blue-600 font-semibold hover:underline"
            >
              Kelola &rarr;
            </router-link>
          </div>
        </div>

        <!-- Card 2: Active Sessions Today -->
        <div class="card-level-1-hover p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <div>
              <p
                class="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Sesi Sedang Aktif
              </p>
              <h3
                class="text-3xl font-extrabold text-slate-900 mt-2 font-mono flex items-center gap-2"
              >
                <span>{{ isLoading ? "—" : activeSessions.length }}</span>
                <span
                  v-if="activeSessions.length > 0"
                  class="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-sans"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                  ></span>
                  Live
                </span>
              </h3>
            </div>
            <div
              class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
          </div>
          <div
            class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
          >
            <span>Sesi absensi aktif hari ini</span>
            <span
              v-if="activeSessions.length > 0"
              class="text-emerald-600 font-semibold"
              >Siap di-scan</span
            >
            <span v-else class="text-slate-400">Tidak ada sesi aktif</span>
          </div>
        </div>
      </div>

      <!-- Active Sessions & Quick Navigation Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Sessions List -->
        <div class="card-level-1 p-6 lg:col-span-2">
          <div
            class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100"
          >
            <div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900">
                Sesi Aktif Hari Ini
              </h2>
              <p class="text-xs text-slate-500">
                Daftar kelas yang sedang membuka presensi barcode.
              </p>
            </div>
            <button
              @click="loadDashboardData"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perbarui data"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="isLoading" class="space-y-3">
            <div
              v-for="i in 2"
              :key="i"
              class="h-20 bg-slate-100 rounded-xl animate-pulse"
            ></div>
          </div>

          <!-- Data List -->
          <div v-else-if="activeSessions.length > 0" class="space-y-3">
            <div
              v-for="session in activeSessions"
              :key="session.sesi_id"
              class="p-4 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50/70 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-slate-900">
                    {{ session.courseName }}
                  </h4>
                  <span
                    class="text-[11px] font-mono font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {{ session.courseKode }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <svg
                    class="w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    >{{ formatTime(session.mulai) }} –
                    {{ formatTime(session.selesai) }}</span
                  >
                  <span class="text-slate-300">&bull;</span>
                  <span class="status-chip status-present text-[11px]">
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                    ></span>
                    Aktif
                  </span>
                </div>
              </div>
              <router-link
                :to="`/dosen/sesi/${session.sesi_id}`"
                class="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-center"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <span>Buka Barcode QR</span>
              </router-link>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state py-10">
            <div
              class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-700 mb-1">
              Belum Ada Sesi Kelas Aktif
            </h4>
            <p class="text-xs text-slate-400 max-w-sm mb-4">
              Buka sesi kehadiran baru pada mata kuliah yang ingin Anda mulai
              hari ini.
            </p>
            <router-link
              to="/dosen/mata-kuliah"
              class="btn-secondary text-xs py-2 px-4"
            >
              Pilih Mata Kuliah &rarr;
            </router-link>
          </div>
        </div>

        <!-- Quick Actions & Links -->
        <div class="card-level-1 p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 mb-1">
              Aksi Cepat
            </h2>
            <p class="text-xs text-slate-500 mb-5">
              Akses cepat ke modul manajemen sistem.
            </p>

            <div class="space-y-3">
              <router-link
                to="/dosen/mata-kuliah"
                class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm font-bold text-slate-800 block"
                      >Kelola Mata Kuliah</span
                    >
                    <span class="text-[11px] text-slate-400"
                      >Atur mata kuliah & buat sesi</span
                    >
                  </div>
                </div>
                <svg
                  class="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </router-link>

              <router-link
                to="/dosen/laporan"
                class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm font-bold text-slate-800 block"
                      >Laporan Absensi</span
                    >
                    <span class="text-[11px] text-slate-400"
                      >Lihat rekapitulasi kehadiran</span
                    >
                  </div>
                </div>
                <svg
                  class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </router-link>
            </div>
          </div>

          <div
            class="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4 text-blue-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Barcode QR otomatis kedaluwarsa sesuai waktu sesi.</span>
          </div>
        </div>
      </div>
    </div>
  </DosenLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DosenLayout from "../../components/DosenLayout.vue";
import courseService from "../../services/course";

const courses = ref([]);
const activeSessions = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

const currentDateFormatted = computed(() => {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const loadDashboardData = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const coursesData = await courseService.getCourses();
    courses.value = coursesData;

    const recapPromises = coursesData.map(async (course) => {
      try {
        const recap = await courseService.getCourseRecap(course.id);
        return recap.map((session) => ({
          ...session,
          courseName: course.nama,
          courseKode: course.kode,
        }));
      } catch (e) {
        console.error(`Failed to load recap for course ${course.id}:`, e);
        return [];
      }
    });

    const recaps = await Promise.all(recapPromises);
    const allSessions = recaps.flat();
    const todayStr = new Date().toDateString();

    activeSessions.value = allSessions.filter((session) => {
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
  if (!dateStr) return "-";
  return (
    new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
};
</script>
