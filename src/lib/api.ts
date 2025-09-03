// src/lib/api.ts
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

export interface PostsResponse {
  success: boolean;
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export interface Post {
  id: string;
  title: string;
  xId: string | null;
  gender: 'male' | 'female';
  allowPromotion: boolean;
  createdAt: string;
  audioUrl: string;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

export const getPosts = async (params: {
  page?: number;
  limit?: number;
  postTitle?: string;
  xId?: string;
  gender?: string;
  tagId?: number;
}): Promise<PostsResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.postTitle) searchParams.set('postTitle', params.postTitle);
    if (params.xId) searchParams.set('xId', params.xId);
    if (params.gender) searchParams.set('gender', params.gender);
    if (params.tagId) searchParams.set('tagId', params.tagId.toString());

    const response = await fetch(`${API_BASE}/api/posts?${searchParams}`);
    return await response.json();
  } catch (error) {
    return { success: false, posts: [], pagination: {} as any, error: 'データ取得に失敗しました' };
  }
};

export const getTags = async (): Promise<{success: boolean; tags: Tag[]; error?: string}> => {
  try {
    const response = await fetch(`${API_BASE}/api/tags`);
    return await response.json();
  } catch (error) {
    return { success: false, tags: [], error: 'タグ取得に失敗しました' };
  }
};
