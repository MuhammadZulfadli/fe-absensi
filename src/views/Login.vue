<template>
  <div class="min-h-screen bg-background flex flex-col justify-between p-6 relative overflow-hidden font-sans">
    <!-- Top Bar / Brand -->
    <header class="max-w-(--spacing-max-width) w-full mx-auto flex items-center justify-between z-10">
      <div class="flex items-center gap-2">
        <span class="text-primary text-2xl">⚡</span>
        <span class="font-semibold text-xl tracking-tight text-on-background">AttendSync<span class="text-primary font-normal">Web</span></span>
      </div>
      <span class="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded font-medium">v1.0.0</span>
    </header>

    <!-- Main Card Container -->
    <main class="flex-grow flex items-center justify-center my-12 z-10">
      <div class="bg-white border border-outline-variant/30 shadow-xs rounded-lg p-8 w-full max-w-[440px] transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <!-- Card Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold tracking-tight text-on-surface mb-2">Selamat Datang</h2>
          <p class="text-sm text-on-surface-variant/80">Silakan masuk untuk mengelola atau mencatat kehadiran kelas Anda.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error Alert -->
          <Transition name="fade">
            <div v-if="errorMessage" class="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded flex items-start gap-2.5 text-sm">
              <span class="mt-0.5">⚠️</span>
              <span class="flex-grow font-medium">{{ errorMessage }}</span>
              <button @click.prevent="errorMessage = ''" class="text-error/70 hover:text-error font-bold ml-1 cursor-pointer">&times;</button>
            </div>
          </Transition>

          <!-- Email Input -->
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Alamat Email</label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-on-surface-variant/60 text-sm">✉️</span>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="nama@univ.ac.id" 
                required
                :disabled="isLoading"
                autocomplete="email"
                class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2.5 pl-9 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Kata Sandi</label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-on-surface-variant/60 text-sm">🔒</span>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="••••••••" 
                required
                :disabled="isLoading"
                autocomplete="current-password"
                class="w-full bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-2.5 pl-9 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-primary text-white font-semibold text-sm py-2.5 px-4 rounded hover:bg-primary-container transition-all shadow-sm hover:shadow active:scale-[0.99] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="w-4 height-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-(--spacing-max-width) w-full mx-auto text-center z-10">
      <p class="text-xs text-on-surface-variant/60">
        &copy; 2026 AttendSync. Hak Cipta Dilindungi.
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
