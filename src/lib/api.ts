const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const uploadAudio = async (formData: FormData) => {
  const response = await fetch(`${API_BASE}/api/upload-audio`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const getPost = async (postId: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/post/${postId}`);
    return await response.json();
  } catch (error) {
    console.error('Get post error:', error);
    return { success: false, error: 'データ取得に失敗しました' };
  }
};
