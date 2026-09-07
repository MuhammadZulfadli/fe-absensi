<template>
  <DosenLayout>
    <div class="card-level-1 p-6 md:p-8 text-left">

      <!-- Header and Add Button -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-6 mb-6">
        <div>
          <h1 class="text-headline-md text-on-surface mb-1">Kelola Mata Kuliah</h1>
          <p class="text-body-sm text-on-surface-variant">Manajemen daftar mata kuliah yang Anda ampu.</p>
        </div>
        <button
          @click="openAddModal"
          class="btn-primary text-xs py-2.5 px-4 w-fit self-start sm:self-center"
        >
          + Tambah Mata Kuliah
        </button>
      </div>

      <!-- Page Error Alert -->
      <Transition name="fade">
        <div v-if="pageError" class="alert-error mb-6">
          <span class="mt-0.5 shrink-0">⚠️</span>
          <div class="flex-grow">
            <span class="font-bold">Gagal memuat mata kuliah:</span> {{ pageError }}
          </div>
          <button @click="fetchCourses" class="text-xs font-bold bg-error/10 hover:bg-error/20 px-2 py-1 rounded cursor-pointer shrink-0">
            Coba Lagi
          </button>
        </div>
      </Transition>

      <!-- Page Success Alert -->
      <Transition name="fade">
        <div v-if="pageSuccess" class="alert-success mb-6">
          <span class="mt-0.5 shrink-0">✅</span>
          <span class="flex-grow font-medium">{{ pageSuccess }}</span>
          <button @click="pageSuccess = ''" class="font-bold ml-1 cursor-pointer opacity-70 hover:opacity-100">&times;</button>
        </div>
      </Transition>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="border border-outline-variant/30 rounded-lg overflow-hidden">
        <div class="bg-surface-container-low h-10 w-full animate-pulse border-b border-outline-variant/30"></div>
        <div class="divide-y divide-outline-variant/20 bg-white">
          <div v-for="i in 3" :key="i" class="p-6 flex items-center justify-between animate-pulse">
            <div class="space-y-2 w-1/3">
              <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-surface-container-high rounded w-16"></div>
            <div class="h-8 bg-surface-container-high rounded w-48"></div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else-if="courses.length > 0" class="border border-outline-variant/30 rounded-lg overflow-hidden">
        <div class="overflow-x-auto max-h-[500px]">
          <table class="min-w-full divide-y divide-outline-variant/30 border-collapse">
            <thead class="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
              <tr>
                <th class="table-header-cell text-left">Kode</th>
                <th class="table-header-cell text-left">Nama Mata Kuliah</th>
                <th class="table-header-cell text-center">SKS</th>
                <th class="table-header-cell text-center">Status Sesi</th>
                <th class="table-header-cell text-center">Aksi Sesi</th>
                <th class="table-header-cell text-center">Pengaturan</th>
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
                <td class="table-data-cell font-mono font-semibold">{{ course.kode }}</td>

                <!-- Name -->
                <td class="table-data-cell font-medium">{{ course.nama }}</td>

                <!-- SKS -->
                <td class="table-data-cell font-mono text-center">{{ course.sks }}</td>

                <!-- Session Status -->
                <td class="table-data-cell text-center">
                  <span v-if="course.sesi_status === 'aktif' || activeSessions[course.id]" class="status-chip status-present">
                    Sesi Berlangsung
                  </span>
                  <span v-else-if="course.sesi_status === 'selesai'" class="inline-flex flex-col items-center gap-1">
                    <span class="status-chip status-closed">Sesi Selesai</span>
                    <span v-if="course.sesi_terakhir_at" class="text-[10px] text-on-surface-variant">
                      {{ new Date(course.sesi_terakhir_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) }}
                    </span>
                  </span>
                  <span v-else class="text-xs text-on-surface-variant/50 italic">—</span>
                </td>

                <!-- Create Session Action -->
                <td class="table-data-cell text-center">
                  <button
                    v-if="course.sesi_status !== 'aktif' && !activeSessions[course.id]"
                    @click="handleCreateSession(course.id)"
                    :disabled="isActionLoading[course.id] || activeSessions[course.id]"
                    class="btn-primary text-xs py-1.5 px-3"
                  >
                    <span v-if="isActionLoading[course.id]" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else>🟢 Buka Sesi</span>
                  </button>
                </td>

                <!-- Edit / Delete -->
                <td class="table-data-cell text-center">
                  <div class="inline-flex items-center gap-2">
                    <button @click="openEditModal(course)" class="btn-secondary text-xs py-1.5 px-3 cursor-pointer">
                      Edit
                    </button>
                    <button @click="confirmDelete(course)" class="btn-danger text-xs py-1.5 px-3 cursor-pointer">
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
      <div v-else class="empty-state py-16">
        <span class="text-4xl opacity-40 mb-3">📚</span>
        <h3 class="text-body-md font-bold text-on-surface mb-1">Belum Ada Mata Kuliah</h3>
        <p class="text-body-sm text-on-surface-variant max-w-sm mb-6">Anda belum pernah menambahkan mata kuliah di sistem ini.</p>
        <button @click="openAddModal" class="btn-primary text-xs py-2 px-5">
          Tambah Sekarang
        </button>
      </div>

    </div>

    <!-- ── Add / Edit Modal ────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
        <div class="card-level-2 p-6 w-full max-w-md text-left">
          <h3 class="text-headline-sm text-on-surface mb-4">
            {{ isEditing ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru' }}
          </h3>

          <Transition name="fade">
            <div v-if="formError" class="alert-error mb-4">
              <span class="shrink-0">⚠️</span>
              <span class="flex-grow font-medium">{{ formError }}</span>
            </div>
          </Transition>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Code -->
            <div class="flex flex-col gap-1">
              <label for="modal-kode" class="text-label-sm text-on-surface-variant uppercase tracking-wider">Kode Mata Kuliah</label>
              <input
                type="text" id="modal-kode" v-model="currentCourse.kode"
                placeholder="e.g. IF1234" required :disabled="isSubmitting"
                class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>

            <!-- Name -->
            <div class="flex flex-col gap-1">
              <label for="modal-nama" class="text-label-sm text-on-surface-variant uppercase tracking-wider">Nama Mata Kuliah</label>
              <input
                type="text" id="modal-nama" v-model="currentCourse.nama"
                placeholder="e.g. Pemrograman Web" required :disabled="isSubmitting"
                class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>

            <!-- SKS -->
            <div class="flex flex-col gap-1">
              <label for="modal-sks" class="text-label-sm text-on-surface-variant uppercase tracking-wider">Beban SKS (1 – 6)</label>
              <input
                type="number" id="modal-sks" v-model.number="currentCourse.sks"
                min="1" max="6" required :disabled="isSubmitting"
                class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 font-mono"
              />
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-3 border-t border-outline-variant/30 pt-4 mt-6">
              <button type="button" @click="showModal = false" :disabled="isSubmitting" class="btn-secondary cursor-pointer">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting" class="btn-primary cursor-pointer flex items-center gap-1.5">
                <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ isEditing ? 'Simpan' : 'Tambah' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirmation Modal ──────────────────────────── -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
        <div class="card-level-2 p-6 w-full max-w-md text-left">
          <h3 class="text-headline-sm text-on-surface mb-2">Hapus Mata Kuliah?</h3>
          <p class="text-body-sm text-on-surface-variant mb-6">
            Apakah Anda yakin ingin menghapus mata kuliah
            <span class="font-semibold text-on-surface">"{{ courseToDelete?.nama }}"</span>?
            Tindakan ini akan menghapus semua riwayat sesi dan data absensi secara permanen.
          </p>
          <div class="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
            <button type="button" @click="showDeleteConfirm = false" :disabled="isSubmitting" class="btn-secondary cursor-pointer">
              Batal
            </button>
            <button type="button" @click="handleDelete" :disabled="isSubmitting" class="btn-primary bg-error hover:bg-error/90 cursor-pointer flex items-center gap-1.5">
              <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </DosenLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DosenLayout from '../../components/DosenLayout.vue';
import authService from '../../services/auth';
import courseService from '../../services/course';
import sessionService from '../../services/session';

const router = useRouter();
const courses = ref([]);
const isLoading = ref(true);
const pageError = ref('');
const pageSuccess = ref('');
const isActionLoading = ref({});
const activeSessions = ref({});

const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const formError = ref('');
const currentCourse = ref({ id: null, kode: '', nama: '', sks: 3 });

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
  if (!currentCourse.value.kode.trim()) { formError.value = 'Kode mata kuliah tidak boleh kosong.'; return; }
  if (!currentCourse.value.nama.trim()) { formError.value = 'Nama mata kuliah tidak boleh kosong.'; return; }
  if (currentCourse.value.sks < 1 || currentCourse.value.sks > 6) { formError.value = 'Beban SKS harus antara 1 hingga 6.'; return; }

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
    const response = await sessionService.createSession({ mata_kuliah_id: courseId });
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
</script>
