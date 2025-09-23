import { toast } from 'react-toastify';

const handleApiResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    toast.error('Session expired or unauthorized. Please log in again.');
    window.location.href = '/login';
    return null;
  }

  if (response.ok) {
    return response.json();
  } else {
    // Attempt to parse JSON for error details, but handle cases where it's not JSON
    try {
      const errorData = await response.json();
      // If it's a 404, we might want a specific message
      if (response.status === 404 && errorData.message) {
        throw new Error(errorData.message);
      }
      throw new Error(errorData.error || errorData.message || `API Error: ${response.status}`);
    } catch (e) {
      // If response is not JSON or parsing fails
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
  }
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