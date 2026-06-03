import api from './api';

export const attendanceService = {
  async recordAttendance(barcodeToken) {
    try {
      const response = await api.post('/absensi', { barcode_token: barcodeToken });
      return response.data;
    } catch (error) {
      console.error('Attendance recording error:', error);
      throw error.response?.data?.message || 'Gagal merekam absensi. Silakan coba lagi.';
    }
  },

  async getMyAttendance() {
    try {
      const response = await api.get('/absensi/saya');
      return response.data.history || [];
    } catch (error) {
      console.error('Fetch my attendance error:', error);
      throw error.response?.data?.message || 'Gagal mengambil riwayat absensi.';
    }
  }
};

export default attendanceService;
