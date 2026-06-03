import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/auth';

const routes = [
  {
    path: '/',
    redirect: () => {
      const user = authService.getUser();
      if (!user) return '/login';
      return user.role === 'mahasiswa' ? '/mahasiswa/scan' : '/dosen/dashboard';
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guestOnly: true }
  },
  // Mahasiswa Routes
  {
    path: '/mahasiswa/scan',
    name: 'MahasiswaScan',
    component: () => import('../views/mahasiswa/Scan.vue'),
    meta: { requiresAuth: true, role: 'mahasiswa' }
  },
  {
    path: '/mahasiswa/riwayat',
    name: 'MahasiswaRiwayat',
    component: () => import('../views/mahasiswa/Riwayat.vue'),
    meta: { requiresAuth: true, role: 'mahasiswa' }
  },
  // Dosen Routes
  {
    path: '/dosen/dashboard',
    name: 'DosenDashboard',
    component: () => import('../views/dosen/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'dosen' }
  },
  {
    path: '/dosen/mata-kuliah',
    name: 'DosenMataKuliah',
    component: () => import('../views/dosen/MataKuliah.vue'),
    meta: { requiresAuth: true, role: 'dosen' }
  },
  {
    path: '/dosen/sesi/:id',
    name: 'DosenSesi',
    component: () => import('../views/dosen/Sesi.vue'),
    meta: { requiresAuth: true, role: 'dosen' }
  },
  {
    path: '/dosen/laporan',
    name: 'DosenLaporan',
    component: () => import('../views/dosen/Laporan.vue'),
    meta: { requiresAuth: true, role: 'dosen' }
  },
  // Fallback redirect
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Not logged in -> Redirect to login
      next({ name: 'Login' });
    } else {
      // Logged in -> Check role
      const requiredRole = to.meta.role;
      if (requiredRole && user.role !== requiredRole) {
        // Role mismatch -> Redirect to root (which redirects to their appropriate dashboard)
        next({ path: '/' });
      } else {
        next();
      }
    }
  } 
  // Guest-only route (e.g. Login page)
  else if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAuthenticated) {
      // Already logged in -> Redirect to root (which redirects to their dashboard)
      next({ path: '/' });
    } else {
      next();
    }
  } 
  // Public route
  else {
    next();
  }
});

export default router;
