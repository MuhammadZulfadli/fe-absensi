import api from './api';

export const courseService = {
  async getCourses() {
    try {
      const response = await api.get('/mata-kuliah');
      return response.data;
    } catch (error) {
      console.error('Fetch courses error:', error);
      throw error.response?.data?.message || 'Gagal mengambil daftar mata kuliah.';
    }
  },

  async createCourse(courseData) {
    try {
      const response = await api.post('/mata-kuliah', courseData);
      return response.data;
    } catch (error) {
      console.error('Create course error:', error);
      throw error.response?.data?.message || 'Gagal membuat mata kuliah baru.';
    }
  },

  async updateCourse(id, courseData) {
    try {
      const response = await api.put(`/mata-kuliah/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Update course error:', error);
      throw error.response?.data?.message || 'Gagal memperbarui mata kuliah.';
    }
  },

  async deleteCourse(id) {
    try {
      const response = await api.delete(`/mata-kuliah/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error.response?.data?.message || 'Gagal menghapus mata kuliah.';
    }
  },

  async getCourseRecap(id) {
    try {
      const response = await api.get(`/mata-kuliah/${id}/rekap`);
      return response.data.recap || [];
    } catch (error) {
      console.error('Get course recap error:', error);
      throw error.response?.data?.message || 'Gagal mengambil rekap mata kuliah.';
    }
  }
};

export default courseService;
