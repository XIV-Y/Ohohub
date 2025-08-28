const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const uploadAudio = async (formData: FormData) => {
  const response = await fetch(`${API_BASE}/api/upload-audio`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};
