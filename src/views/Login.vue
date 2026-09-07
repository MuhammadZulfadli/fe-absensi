<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans select-none">
    
    <!-- Ambient Background Light Effects -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Top Bar / Brand -->
    <header class="max-w-(--spacing-max-width) w-full mx-auto flex items-center justify-between z-10 py-2">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="font-bold text-xl tracking-tight text-white">Attend<span class="text-blue-400">Sync</span></span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-blue-300 bg-blue-900/60 border border-blue-700/50 px-3 py-1 rounded-full backdrop-blur-xs">
          v1.0.0
        </span>
      </div>
    </header>

    <!-- Main Card Container -->
    <main class="flex-grow flex items-center justify-center my-8 z-10">
      <div class="bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-7 sm:p-9 w-full max-w-[420px] transition-all duration-300 animate-slide-up">
        
        <!-- Card Header -->
        <div class="text-center mb-7">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs border border-blue-100">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 mb-1">Masuk ke Akun</h2>
          <p class="text-sm text-slate-500">Kelola presensi atau lakukan absensi kelas online.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Error Alert -->
          <Transition name="fade">
            <div v-if="errorMessage" class="alert-error text-left">
              <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="flex-grow text-xs sm:text-sm font-medium">{{ errorMessage }}</span>
              <button @click.prevent="errorMessage = ''" class="text-rose-400 hover:text-rose-700 font-bold ml-1 cursor-pointer">&times;</button>
            </div>
          </Transition>

          <!-- Email Input -->
          <div class="flex flex-col gap-1.5 text-left">
            <label for="email" class="text-xs font-bold text-slate-700 uppercase tracking-wider">Alamat Email</label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="nama@univ.ac.id"
                required
                :disabled="isLoading"
                autocomplete="email"
                class="input-modern pl-10"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="flex flex-col gap-1.5 text-left">
            <label for="password" class="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi</label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="••••••••"
                required
                :disabled="isLoading"
                autocomplete="current-password"
                class="input-modern pl-10 pr-10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                tabindex="-1"
              >
                <!-- Eye Open -->
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye Closed -->
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary w-full py-3 mt-2 shadow-md shadow-blue-500/20 text-sm font-semibold"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else class="flex items-center gap-2">
              <span>Masuk ke Akun</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </form>

        <!-- Role Helper info -->
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <svg class="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Gunakan akun Dosen atau Mahasiswa terdaftar</span>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-(--spacing-max-width) w-full mx-auto text-center z-10 py-2">
      <p class="text-xs text-slate-400">
        &copy; 2026 AttendSync Pro. Hak Cipta Dilindungi.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const user = await authService.login(email.value, password.value);

    // Redirect based on user role
    if (user.role === 'mahasiswa') {
      router.push('/mahasiswa/scan');
    } else if (user.role === 'dosen') {
      router.push('/dosen/dashboard');
    } else {
      errorMessage.value = 'Role user tidak dikenali.';
      authService.logout();
    }
  } catch (error) {
    errorMessage.value = error;
  } finally {
    isLoading.value = false;
  }
};
</script>