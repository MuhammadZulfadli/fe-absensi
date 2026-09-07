<template>
  <DosenLayout>
    <div class="space-y-6 text-left">
      <!-- Page Header & Action -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1
              class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              Kelola Mata Kuliah
            </h1>
            <span
              class="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full"
            >
              {{ courses.length }} Kelas
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500">
            Daftar mata kuliah yang Anda ampu dan status sesi presensi.
          </p>
        </div>
        <button
          @click="openAddModal"
          class="btn-primary py-2.5 px-4 self-start sm:self-center text-xs sm:text-sm shadow-md shadow-blue-500/20"
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
          <span>Tambah Mata Kuliah</span>
        </button>
      </div>

      <!-- Alerts -->
      <Transition name="fade">
        <div v-if="pageError" class="alert-error">
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
          <div class="flex-grow text-xs sm:text-sm">
            <span class="font-bold">Gagal:</span> {{ pageError }}
          </div>
          <button
            @click="fetchCourses"
            class="text-xs font-bold bg-rose-200/50 hover:bg-rose-200 px-2.5 py-1 rounded-lg text-rose-800 cursor-pointer shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="pageSuccess" class="alert-success">
          <svg
            class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="flex-grow text-xs sm:text-sm font-medium">{{
            pageSuccess
          }}</span>
          <button
            @click="pageSuccess = ''"
            class="text-emerald-500 hover:text-emerald-800 font-bold ml-1 cursor-pointer"
          >
            &times;
          </button>
        </div>
      </Transition>

      <!-- Search & Filters Bar -->
      <div
        v-if="courses.length > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div class="relative w-full sm:w-80">
          <span
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari kode atau nama mata kuliah..."
            class="input-modern pl-10 text-xs sm:text-sm py-2"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            &times;
          </button>
        </div>
        <div class="text-xs text-slate-400 self-end sm:self-center">
          Menampilkan
          <span class="font-bold text-slate-700">{{
            filteredCourses.length
          }}</span>
          dari {{ courses.length }} mata kuliah
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="card-level-1 overflow-hidden">
        <div
          class="bg-slate-100 h-11 w-full animate-pulse border-b border-slate-200"
        ></div>
        <div class="divide-y divide-slate-100 bg-white">
          <div
            v-for="i in 4"
            :key="i"
            class="p-5 flex items-center justify-between animate-pulse"
          >
            <div class="space-y-2 w-1/3">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
            <div class="h-6 bg-slate-200 rounded-full w-12"></div>
            <div class="h-6 bg-slate-100 rounded w-24"></div>
            <div class="h-8 bg-slate-200 rounded w-36"></div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div
        v-else-if="filteredCourses.length > 0"
        class="card-level-1 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 border-collapse">
            <thead>
              <tr>
                <th class="table-header-cell text-left">Kode</th>
                <th class="table-header-cell text-left">Nama Mata Kuliah</th>
                <th class="table-header-cell text-center">Beban SKS</th>
                <th class="table-header-cell text-center">Status Sesi</th>
                <th class="table-header-cell text-center">Aksi Sesi</th>
                <th class="table-header-cell text-center">Pengaturan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr
                v-for="(course, index) in filteredCourses"
                :key="course.id"
                class="hover:bg-slate-50/80 transition-colors"
                :class="index % 2 === 1 ? 'bg-slate-50/30' : ''"
              >
                <!-- Code -->
                <td class="table-data-cell font-mono font-bold text-blue-700">
                  <span
                    class="bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded text-xs"
                  >
                    {{ course.kode }}
                  </span>
                </td>

                <!-- Name -->
                <td class="table-data-cell font-bold text-slate-800">
                  {{ course.nama }}
                </td>

                <!-- SKS -->
                <td class="table-data-cell text-center">
                  <span
                    class="inline-flex items-center justify-center font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                  >
                    {{ course.sks }} SKS
                  </span>
                </td>

                <!-- Session Status -->
                <td class="table-data-cell text-center">
                  <span
                    v-if="
                      course.sesi_status === 'aktif' ||
                      activeSessions[course.id]
                    "
                    class="status-chip status-present"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                    ></span>
                    Sesi Berlangsung
                  </span>
                  <span
                    v-else-if="course.sesi_status === 'selesai'"
                    class="inline-flex flex-col items-center gap-0.5"
                  >
                    <span class="status-chip status-closed">Sesi Ditutup</span>
                    <span
                      v-if="course.sesi_terakhir_at"
                      class="text-[10px] text-slate-400 font-mono"
                    >
                      {{
                        new Date(course.sesi_terakhir_at).toLocaleString(
                          "id-ID",
                          { dateStyle: "short", timeStyle: "short" },
                        )
                      }}
                    </span>
                  </span>
                  <span v-else class="text-xs text-slate-400 italic"
                    >Belum ada sesi</span
                  >
                </td>

                <!-- Create Session Action -->
                <td class="table-data-cell text-center">
                  <button
                    v-if="
                      course.sesi_status !== 'aktif' &&
                      !activeSessions[course.id]
                    "
                    @click="handleCreateSession(course.id)"
                    :disabled="
                      isActionLoading[course.id] || activeSessions[course.id]
                    "
                    class="btn-primary text-xs py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20"
                  >
                    <span
                      v-if="isActionLoading[course.id]"
                      class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"
                    ></span>
                    <span v-else class="flex items-center gap-1.5">
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                      </svg>
                      <span>Buka Sesi</span>
                    </span>
                  </button>
                  <router-link
                    v-else
                    :to="`/dosen/dashboard`"
                    class="btn-secondary text-xs py-1.5 px-3 text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100"
                  >
                    Lihat di Dashboard &rarr;
                  </router-link>
                </td>

                <!-- Edit / Delete -->
                <td class="table-data-cell text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <button
                      @click="openEditModal(course)"
                      class="btn-secondary text-xs py-1.5 px-2.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      title="Edit mata kuliah"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      @click="confirmDelete(course)"
                      class="btn-danger text-xs py-1.5 px-2.5"
                      title="Hapus mata kuliah"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State (No search results or no courses) -->
      <div v-else class="empty-state py-16">
        <div
          class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3"
        >
          <svg
            class="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800 mb-1">
          {{
            searchQuery
              ? "Tidak Ada Mata Kuliah yang Cocok"
              : "Belum Ada Mata Kuliah"
          }}
        </h3>
        <p class="text-xs text-slate-500 max-w-sm mb-6">
          {{
            searchQuery
              ? "Coba gunakan kata kunci pencarian kode atau nama yang berbeda."
              : "Anda belum menambahkan mata kuliah untuk dikelola di sistem ini."
          }}
        </p>
        <button
          v-if="!searchQuery"
          @click="openAddModal"
          class="btn-primary text-xs py-2 px-4 shadow-sm"
        >
          + Tambah Mata Kuliah Sekarang
        </button>
        <button
          v-else
          @click="searchQuery = ''"
          class="btn-secondary text-xs py-2 px-4"
        >
          Reset Pencarian
        </button>
      </div>
    </div>

    <!-- ── Add / Edit Modal ────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        >
          <div
            class="card-level-2 p-6 sm:p-8 w-full max-w-md text-left animate-slide-up"
            @click.stop
          >
            <div
              class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
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
                <h3 class="text-lg font-bold text-slate-900">
                  {{
                    isEditing ? "Edit Mata Kuliah" : "Tambah Mata Kuliah Baru"
                  }}
                </h3>
              </div>
              <button
                @click="showModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Modal Error -->
            <Transition name="fade">
              <div v-if="formError" class="alert-error mb-4 text-xs">
                <svg
                  class="w-4 h-4 text-rose-500 shrink-0"
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
                <span class="flex-grow font-medium">{{ formError }}</span>
              </div>
            </Transition>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Code -->
              <div class="flex flex-col gap-1.5">
                <label
                  for="modal-kode"
                  class="text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >Kode Mata Kuliah</label
                >
                <input
                  type="text"
                  id="modal-kode"
                  v-model="currentCourse.kode"
                  placeholder="Contoh: IF1234, TIF301"
                  required
                  :disabled="isSubmitting"
                  class="input-modern font-mono text-sm uppercase"
                />
              </div>

              <!-- Name -->
              <div class="flex flex-col gap-1.5">
                <label
                  for="modal-nama"
                  class="text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >Nama Mata Kuliah</label
                >
                <input
                  type="text"
                  id="modal-nama"
                  v-model="currentCourse.nama"
                  placeholder="Contoh: Pemrograman Web Lanjut"
                  required
                  :disabled="isSubmitting"
                  class="input-modern text-sm"
                />
              </div>

              <!-- SKS -->
              <div class="flex flex-col gap-1.5">
                <label
                  for="modal-sks"
                  class="text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >Beban SKS (1 – 6)</label
                >
                <input
                  type="number"
                  id="modal-sks"
                  v-model.number="currentCourse.sks"
                  min="1"
                  max="6"
                  required
                  :disabled="isSubmitting"
                  class="input-modern font-mono text-sm"
                />
              </div>

              <!-- Buttons -->
              <div
                class="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100"
              >
                <button
                  type="button"
                  @click="showModal = false"
                  :disabled="isSubmitting"
                  class="btn-secondary text-xs sm:text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="btn-primary text-xs sm:text-sm cursor-pointer shadow-sm"
                >
                  <span
                    v-if="isSubmitting"
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  ></span>
                  <span v-else>{{
                    isEditing ? "Simpan Perubahan" : "Tambah Mata Kuliah"
                  }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Delete Confirmation Modal ──────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        >
          <div
            class="card-level-2 p-6 sm:p-8 w-full max-w-md text-left animate-slide-up"
            @click.stop
          >
            <div
              class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">
              Hapus Mata Kuliah?
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus mata kuliah
              <strong class="text-slate-800"
                >"{{ courseToDelete?.nama }}" ({{
                  courseToDelete?.kode
                }})</strong
              >? Seluruh riwayat sesi kelas dan log presensi terkait akan
              dihapus secara permanen.
            </p>
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                @click="showDeleteConfirm = false"
                :disabled="isSubmitting"
                class="btn-secondary text-xs sm:text-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                @click="handleDelete"
                :disabled="isSubmitting"
                class="btn-danger text-xs sm:text-sm cursor-pointer bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
              >
                <span
                  v-if="isSubmitting"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span v-else>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DosenLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import DosenLayout from "../../components/DosenLayout.vue";
import courseService from "../../services/course";
import sessionService from "../../services/session";

const router = useRouter();
const courses = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const pageError = ref("");
const pageSuccess = ref("");
const isActionLoading = ref({});
const activeSessions = ref({});

const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const formError = ref("");
const currentCourse = ref({ id: null, kode: "", nama: "", sks: 3 });

const showDeleteConfirm = ref(false);
const courseToDelete = ref(null);

const filteredCourses = computed(() => {
  if (!searchQuery.value.trim()) return courses.value;
  const q = searchQuery.value.toLowerCase().trim();
  return courses.value.filter(
    (c) =>
      (c.nama && c.nama.toLowerCase().includes(q)) ||
      (c.kode && c.kode.toLowerCase().includes(q)),
  );
});

const fetchCourses = async () => {
  isLoading.value = true;
  pageError.value = "";
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
  formError.value = "";
  currentCourse.value = { id: null, kode: "", nama: "", sks: 3 };
  showModal.value = true;
};

const openEditModal = (course) => {
  isEditing.value = true;
  formError.value = "";
  currentCourse.value = { ...course };
  showModal.value = true;
};

const handleSubmit = async () => {
  if (!currentCourse.value.kode.trim()) {
    formError.value = "Kode mata kuliah tidak boleh kosong.";
    return;
  }
  if (!currentCourse.value.nama.trim()) {
    formError.value = "Nama mata kuliah tidak boleh kosong.";
    return;
  }
  if (currentCourse.value.sks < 1 || currentCourse.value.sks > 6) {
    formError.value = "Beban SKS harus antara 1 hingga 6.";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";
  try {
    if (isEditing.value) {
      const response = await courseService.updateCourse(
        currentCourse.value.id,
        {
          kode: currentCourse.value.kode,
          nama: currentCourse.value.nama,
          sks: currentCourse.value.sks,
        },
      );
      pageSuccess.value =
        response.message || "Mata kuliah berhasil diperbarui.";
    } else {
      const response = await courseService.createCourse({
        kode: currentCourse.value.kode,
        nama: currentCourse.value.nama,
        sks: currentCourse.value.sks,
      });
      pageSuccess.value =
        response.message || "Mata kuliah baru berhasil ditambahkan.";
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
    pageSuccess.value = response.message || "Mata kuliah berhasil dihapus.";
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
  pageError.value = "";
  try {
    const response = await sessionService.createSession({
      mata_kuliah_id: courseId,
    });
    const sessionId = response.session?.id;
    if (sessionId) {
      router.push(`/dosen/sesi/${sessionId}`);
    } else {
      throw new Error("ID sesi tidak ditemukan.");
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
