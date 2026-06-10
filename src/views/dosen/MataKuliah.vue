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
          <router-link to="/dosen/dashboard" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5">
            Dashboard
          </router-link>
          <router-link to="/dosen/mata-kuliah" class="flex items-center py-3 pl-4 pr-6 text-sm font-medium transition-all border-l-4 border-primary bg-white/10 text-white">
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
        <!-- Content Card -->
        <div class="bg-white border border-[#e5e7eb] rounded-lg p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
          
          <!-- Header and Add Button -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-6 mb-6">
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-on-surface mb-1">Kelola Mata Kuliah</h1>
              <p class="text-sm text-on-surface-variant">Manajemen daftar mata kuliah yang Anda ampu.</p>
            </div>
            
            <button @click="openAddModal" class="inline-flex items-center justify-center bg-primary text-white font-semibold text-xs py-2.5 px-4 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer w-fit self-start sm:self-center">
              + Tambah Mata Kuliah
            </button>
          </div>

          <!-- Page Error Alert -->
          <div v-if="pageError" class="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded flex items-start gap-2.5 text-sm mb-6">
            <span class="mt-0.5">⚠️</span>
            <div class="flex-grow">
              <span class="font-bold">Gagal memuat mata kuliah:</span> {{ pageError }}
            </div>
            <button @click="fetchCourses" class="text-xs font-bold bg-error/10 hover:bg-error/20 px-2 py-1 rounded cursor-pointer">Coba Lagi</button>
          </div>

          <!-- Page Success Alert -->
          <div v-if="pageSuccess" class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded flex items-start gap-2.5 text-sm mb-6">
            <span class="mt-0.5">✅</span>
            <span class="flex-grow font-medium">{{ pageSuccess }}</span>
            <button @click="pageSuccess = ''" class="text-emerald-700 hover:text-emerald-900 font-bold ml-1 cursor-pointer">&times;</button>
          </div>

          <!-- Loading State (Table Skeleton) -->
          <div v-if="isLoading" class="border border-outline-variant/30 rounded-lg overflow-hidden">
            <div class="bg-surface-container-low h-10 w-full animate-pulse border-b border-outline-variant/30"></div>
            <div class="divide-y divide-[#e5e7eb] bg-white">
              <div v-for="i in 3" :key="i" class="p-6 flex items-center justify-between animate-pulse">
                <div class="space-y-2 w-1/3">
                  <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div class="h-4 bg-slate-100 rounded w-16"></div>
                <div class="h-8 bg-slate-100 rounded w-48"></div>
              </div>
            </div>
          </div>

          <!-- Data Table (Zebra, Sticky Header, Dense padding) -->
          <div v-else-if="courses.length > 0" class="border border-outline-variant/30 rounded-lg overflow-hidden">
            <div class="overflow-x-auto max-h-[500px]">
              <table class="min-w-full divide-y divide-outline-variant/30 border-collapse">
                <thead class="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                  <tr>
                    <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kode</th>
                    <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Mata Kuliah</th>
                    <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">SKS</th>
                    <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status Sesi</th>
                    <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Aksi Sesi</th>
                    <th class="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Pengaturan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/20 bg-white">
                  <tr 
                    v-for="(course, index) in courses" 
                    :key="course.id" 
                    class="transition-colors hover:bg-surface-container-low/30"
                    :class="index % 2 === 1 ? 'bg-surface-container-low/10' : ''"
                  >
                    <!-- Code -->
                    <td class="px-6 py-3 font-mono text-sm text-on-surface font-semibold">{{ course.kode }}</td>
                    
                    <!-- Name -->
                    <td class="px-6 py-3 text-sm text-on-surface font-medium">{{ course.nama }}</td>
                    
                    <!-- SKS (Numeric monospace) -->
                    <td class="px-6 py-3 text-sm text-on-surface font-mono text-center">{{ course.sks }}</td>
                    
                    <!-- Session Status -->
                    <td class="px-6 py-3 text-center">
                      <span v-if="course.sesi_status === 'aktif' || activeSessions[course.id]" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Sesi Berlangsung
                      </span>
                      <span v-else-if="course.sesi_status === 'selesai'" class="inline-flex flex-col items-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Sesi Selesai
                        </span>
                        <span v-if="course.sesi_terakhir_at" class="text-[10px] text-gray-500 mt-1">
                          {{ new Date(course.sesi_terakhir_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) }}
                        </span>
                      </span>
                      <span v-else class="text-xs text-gray-400 italic">
                        -
                      </span>
                    </td>
                    
                    <!-- Active Actions (Buka Sesi) -->
                    <td class="px-6 py-3 text-center">
                      <button 
                        v-if="course.sesi_status !== 'aktif' && !activeSessions[course.id]"
                        @click="handleCreateSession(course.id)" 
                        :disabled="isActionLoading[course.id] || activeSessions[course.id]"
                        class="inline-flex items-center gap-1.5 bg-primary text-white font-semibold text-xs py-1.5 px-3 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span v-if="isActionLoading[course.id]" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span v-else>{{ activeSessions[course.id] ? 'Sesi Aktif' : '🟢 Buka Sesi' }}</span>
                      </button>
                    </td>

                    <!-- Edit / Delete -->
                    <td class="px-6 py-3 text-center">
                      <div class="inline-flex items-center gap-2">
                        <button @click="openEditModal(course)" class="border border-outline/30 text-on-surface-variant hover:bg-surface-container-low font-semibold text-xs py-1.5 px-3 rounded transition-colors cursor-pointer">
                          Edit
                        </button>
                        <button @click="confirmDelete(course)" class="bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs py-1.5 px-3 rounded transition-colors cursor-pointer border border-red-200/50">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-[#f9fafb] border border-dashed border-[#e5e7eb] rounded-lg p-16 flex flex-col items-center justify-center text-center">
            <span class="text-4xl opacity-40 mb-3">📚</span>
            <h3 class="text-base font-bold text-on-surface mb-1">Belum Ada Mata Kuliah</h3>
            <p class="text-sm text-on-surface-variant max-w-sm mb-6">Anda belum pernah menambahkan mata kuliah di sistem ini.</p>
            <button @click="openAddModal" class="bg-primary text-white font-semibold text-xs py-2 px-5 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer">
              Tambah Sekarang
            </button>
          </div>

        </div>
      </main>
    </div>

    <!-- Modal Form (Level 2 Elevation, custom inputs & validators) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-white border border-[#e5e7eb] rounded-lg shadow-xl p-6 w-full max-w-md text-left transition-all scale-100">
        <!-- Modal Title -->
        <h3 class="text-lg font-bold text-on-surface mb-4">
          {{ isEditing ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru' }}
        </h3>

        <!-- Form Error Alert -->
        <div v-if="formError" class="bg-error-container/20 border border-error/30 text-error px-3 py-2.5 rounded flex items-start gap-2 text-xs mb-4">
          <span>⚠️</span>
          <span class="flex-grow font-medium">{{ formError }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Code Input -->
          <div class="flex flex-col gap-1">
            <label for="modal-kode" class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Kode Mata Kuliah</label>
            <input 
              type="text" 
              id="modal-kode" 
              v-model="currentCourse.kode" 
              placeholder="e.g. IF1234" 
              required
              :disabled="isSubmitting"
              class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
          </div>

          <!-- Name Input -->
          <div class="flex flex-col gap-1">
            <label for="modal-nama" class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Mata Kuliah</label>
            <input 
              type="text" 
              id="modal-nama" 
              v-model="currentCourse.nama" 
              placeholder="e.g. Pemrograman Web" 
              required
              :disabled="isSubmitting"
              class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
          </div>

          <!-- SKS Input -->
          <div class="flex flex-col gap-1">
            <label for="modal-sks" class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Beban SKS (1 - 6)</label>
            <input 
              type="number" 
              id="modal-sks" 
              v-model.number="currentCourse.sks" 
              min="1" 
              max="6" 
              required
              :disabled="isSubmitting"
              class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 font-mono"
            />
          </div>

          <!-- Modal Buttons -->
          <div class="flex justify-end gap-3 border-t border-outline-variant/30 pt-4 mt-6">
            <button 
              type="button" 
              @click="showModal = false" 
              :disabled="isSubmitting"
              class="border border-outline/30 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="bg-primary text-white font-semibold text-sm py-2 px-5 rounded hover:bg-primary-container transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ isEditing ? 'Simpan' : 'Tambah' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-white border border-[#e5e7eb] rounded-lg shadow-xl p-6 w-full max-w-md text-left transition-all">
        <h3 class="text-lg font-bold text-on-surface mb-2">Hapus Mata Kuliah?</h3>
        <p class="text-sm text-on-surface-variant mb-6">
          Apakah Anda yakin ingin menghapus mata kuliah <span class="font-semibold text-on-surface">"{{ courseToDelete?.nama }}"</span>? Tindakan ini akan menghapus semua riwayat sesi dan data absensi yang berkaitan dengan mata kuliah ini secara permanen.
        </p>

        <!-- Modal Buttons -->
        <div class="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
          <button 
            type="button" 
            @click="showDeleteConfirm = false" 
            :disabled="isSubmitting"
            class="border border-outline/30 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            type="button" 
            @click="handleDelete" 
            :disabled="isSubmitting"
            class="bg-error text-white font-semibold text-sm py-2 px-5 rounded hover:bg-error-container transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/auth';
import courseService from '../../services/course';
import sessionService from '../../services/session';

const router = useRouter();
const user = ref(null);

const courses = ref([]);
const isLoading = ref(true);
const pageError = ref('');
const pageSuccess = ref('');

// Action loadings (e.g. key is courseId, value is boolean)
const isActionLoading = ref({});
const activeSessions = ref({});

// Modal variables
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const formError = ref('');
const currentCourse = ref({ id: null, kode: '', nama: '', sks: 3 });

// Delete variables
const showDeleteConfirm = ref(false);
const courseToDelete = ref(null);

const fetchCourses = async () => {
  isLoading.value = true;
  pageError.value = '';
  try {
    const data = await courseService.getCourses();
    courses.value = data;
  } catch (error) {
    pageError.value = error;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  user.value = authService.getUser();
  fetchCourses();
});

const openAddModal = () => {
  isEditing.value = false;
  formError.value = '';
  currentCourse.value = { id: null, kode: '', nama: '', sks: 3 };
  showModal.value = true;
};

const openEditModal = (course) => {
  isEditing.value = true;
  formError.value = '';
  currentCourse.value = { ...course };
  showModal.value = true;
};

const handleSubmit = async () => {
  // Client-side validations
  if (!currentCourse.value.kode.trim()) {
    formError.value = 'Kode mata kuliah tidak boleh kosong.';
    return;
  }
  if (!currentCourse.value.nama.trim()) {
    formError.value = 'Nama mata kuliah tidak boleh kosong.';
    return;
  }
  if (currentCourse.value.sks < 1 || currentCourse.value.sks > 6) {
    formError.value = 'Beban SKS harus berada antara 1 hingga 6.';
    return;
  }

  isSubmitting.value = true;
  formError.value = '';
  try {
    if (isEditing.value) {
      const response = await courseService.updateCourse(currentCourse.value.id, {
        kode: currentCourse.value.kode,
        nama: currentCourse.value.nama,
        sks: currentCourse.value.sks
      });
      pageSuccess.value = response.message || 'Mata kuliah berhasil diperbarui.';
    } else {
      const response = await courseService.createCourse({
        kode: currentCourse.value.kode,
        nama: currentCourse.value.nama,
        sks: currentCourse.value.sks
      });
      pageSuccess.value = response.message || 'Mata kuliah baru berhasil ditambahkan.';
    }
    showModal.value = false;
    await fetchCourses();
  } catch (error) {
    formError.value = error;
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (course) => {
  courseToDelete.value = course;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (!courseToDelete.value) return;
  isSubmitting.value = true;
  try {
    const response = await courseService.deleteCourse(courseToDelete.value.id);
    pageSuccess.value = response.message || 'Mata kuliah berhasil dihapus.';
    showDeleteConfirm.value = false;
    await fetchCourses();
  } catch (error) {
    pageError.value = error;
    showDeleteConfirm.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const handleCreateSession = async (courseId) => {
  isActionLoading.value[courseId] = true;
  pageError.value = '';
  try {
    const response = await sessionService.createSession({
      mata_kuliah_id: courseId
    });
    const sessionId = response.session?.id;
    if (sessionId) {
      router.push(`/dosen/sesi/${sessionId}`);
    } else {
      throw new Error('ID sesi tidak ditemukan.');
    }
  } catch (error) {
    if (error.status === 409) {
      pageError.value = error.message;
      activeSessions.value[courseId] = true;
    } else {
      pageError.value = error.message || error;
    }
  } finally {
    isActionLoading.value[courseId] = false;
  }
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>
