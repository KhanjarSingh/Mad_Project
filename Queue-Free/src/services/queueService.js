const BASE_URL = 'http://localhost:3000'; // Change this to your server URL

export const queueService = {
    // Get all available queues
    getAllQueues: async () => {
        try {
            const response = await fetch(`${BASE_URL}/queues`);
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

    // Get queue details by ID
    getQueueDetails: async (queueId) => {
        try {
            const response = await fetch(`${BASE_URL}/queues/${queueId}`);
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

    // Join a queue
    joinQueue: async (queueId, token) => {
        try {
            const response = await fetch(`${BASE_URL}/queues/${queueId}/join`, {
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

    // Leave a queue
    leaveQueue: async (queueId, token) => {
        try {
            const response = await fetch(`${BASE_URL}/queues/${queueId}/leave`, {
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

    // Create a new queue
    createQueue: async (queueData, token) => {
        try {
            const response = await fetch(`${BASE_URL}/queues`, {
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

    // Get user's active queues
    getUserQueues: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/queues/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch user queues');
            }

            return data;
        } catch (error) {
            console.error('Get user queues error:', error);
            throw error;
        }
    },
};