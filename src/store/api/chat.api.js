import api from 'src/utils/axios';

export const chatApi = {
  getChatList: (type) => api.get(`/api/chat/getChatList?type=${type}`),
  
  getMessages: (chatId, page = 1, limit = 20) => 
    api.get(`/api/chat/getMessages/${chatId}?page=${page}&limit=${limit}`),
  
  sendMessage: (formData) => api.post('/api/chat/sendMessage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  initChat: (data) => api.post('/api/chat/initChat', data),
};
