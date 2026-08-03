import axiosClient from './axiosClient';

export const authApi = {
  register: async (userData) => {
    // Expected userData: { username, email, password }
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    // FastAPI OAuth2PasswordBearer expects form data: username and password
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await axiosClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  generateKeys: async () => {
    const response = await axiosClient.post('/auth/keys/generate');
    // The backend returns { "private_key": "-----BEGIN..." }
    const privateKeyStr = response.data.private_key;
    // Convert the plain string to a Blob so it downloads as a properly formatted .pem file
    return new Blob([privateKeyStr], { type: 'application/x-pem-file' });
  }
};
