import { API_URL } from '../config/api';
import { authService } from './authService';

export const queueService = {
  getAllQueues: async () => {
    try {
      const response = await fetch(`${API_URL}/queues`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch queues');
      }

      return data;
    } catch (error) {
      console.error('Get queues error:', error);
      throw error;
    }
  },

  getQueueDetails: async (queueId) => {
    try {
      const response = await fetch(`${API_URL}/queues/${queueId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch queue details');
      }

      return data;
    } catch (error) {
      console.error('Get queue details error:', error);
      throw error;
    }
  },

  joinQueue: async (queueId) => {
    try {
      const token = await authService.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/queues/${queueId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join queue');
      }

      return data;
    } catch (error) {
      console.error('Join queue error:', error);
      throw error;
    }
  },

  leaveQueue: async (queueId) => {
    try {
      const token = await authService.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/queues/${queueId}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to leave queue');
      }

      return data;
    } catch (error) {
      console.error('Leave queue error:', error);
      throw error;
    }
  },

  createQueue: async (queueData) => {
    try {
      const token = await authService.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/queues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queueData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create queue');
      }

      return data;
    } catch (error) {
      console.error('Create queue error:', error);
      throw error;
    }
  },
};