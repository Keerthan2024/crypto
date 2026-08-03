import axiosClient from './axiosClient';

export const fileApi = {
  uploadFile: async (formData) => {
    // Expected formData containing: 'file' (Blob), 'recipient_username', 'expiry_hours'
    const response = await axiosClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getShareStatus: async (shareToken) => {
    const response = await axiosClient.get(`/files/share/${shareToken}/status`);
    return response.data;
  },

  getQRData: async (shareToken) => {
    const response = await axiosClient.get(`/files/share/${shareToken}/qr`, {
      responseType: 'blob'
    });
    return response.data;
  },

  downloadFile: async (shareToken, privateKey) => {
    const response = await axiosClient.post(`/files/share/${shareToken}/download`, 
      { private_key: privateKey },
      { responseType: 'blob' } // Expecting the binary file back
    );
    return response;
  }
};
