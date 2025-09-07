import { toast } from 'react-toastify';

const handleApiResponse = async (response) => {
  if (response.status === 401) {
    // Unauthorized: Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    toast.error('Session expired or unauthorized. Please log in again.');
    // Redirect to login page
    window.location.href = '/login'; // Or use history.push('/login') if available
    return null; // Prevent further processing
  }
  return response;
};

const api = {
  get: async (url, token) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return handleApiResponse(response);
  },

  post: async (url, data, token) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },
  // Add other methods (put, delete) as needed
};

export default api;