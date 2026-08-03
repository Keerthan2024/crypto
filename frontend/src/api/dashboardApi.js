import axiosClient from './axiosClient';

export const dashboardApi = {
  getSentFiles: async (page = 1, size = 20) => {
    const response = await axiosClient.get(`/users/me/files/sent?page=${page}&size=${size}`);
    return response.data;
  },

  getReceivedFiles: async (page = 1, size = 20) => {
    const response = await axiosClient.get(`/users/me/files/received?page=${page}&size=${size}`);
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await axiosClient.delete(`/files/${fileId}`);
    return response.data;
  }
};
