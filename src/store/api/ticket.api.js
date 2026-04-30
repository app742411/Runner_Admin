import axios from './axios';

export const ticketApi = {
  createTicket: (data) => axios.post('/api/ticket/createTicket', data),
  getTickets: (params) => axios.get('/api/ticket/getTickets', { params }),
  getTicketById: (id) => axios.get(`/api/ticket/getTicket/${id}`),
  getAssignableUsers: () => axios.get('/api/ticket/getAssignableUsers'),
  acceptTicket: (ticketId, data) => axios.patch(`/api/ticket/acceptTicket/${ticketId}`, data),
};
