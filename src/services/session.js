import api from './api';

export const sessionService = {
  async createSession(sessionData) {
    try {
      const response = await api.post('/sesi', sessionData);
      return response.data;
    } catch (error) {
      console.error('Create session error:', error);
      throw error.response?.data?.message || 'Gagal membuat sesi baru.';
    }
  },

  async getBarcode(id) {
    try {
      const response = await api.get(`/sesi/${id}/barcode`);
      return response.data;
    } catch (error) {
      console.error('Get session barcode error:', error);
      throw error.response?.data?.message || 'Gagal mengambil barcode sesi.';
    }
  },

  async closeSession(id) {
    try {
      const response = await api.patch(`/sesi/${id}/tutup`);
      return response.data;
    } catch (error) {
      console.error('Close session error:', error);
      throw error.response?.data?.message || 'Gagal menutup sesi kelas.';
    }
  },

  async getSessionAttendance(id) {
    try {
      const response = await api.get(`/sesi/${id}/absensi`);
      return response.data.attendance || [];
    } catch (error) {
      console.error('Get session attendance error:', error);
      throw error.response?.data?.message || 'Gagal mengambil data kehadiran sesi.';
    }
  }
};

export default sessionService;
