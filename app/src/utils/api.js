import { toast } from 'react-toastify';

const handleApiResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');

    localStorage.removeItem('username');
    localStorage.removeItem('name');
    toast.error('Session expired or unauthorized. Please log in again.');
    window.location.href = '/login';
    return null;
  }

  if (response.ok) {
    return response.json();
  } else {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
  }
};

const api = {
  get: async (url, token) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'Cache-Control': 'no-cache',
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

  put: async (url, data, token) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },
  // Add other methods (delete) as needed
};

export default api;