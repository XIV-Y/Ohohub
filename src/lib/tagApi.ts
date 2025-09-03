const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

export interface TagsResponse {
  success: boolean;
  tags: Tag[];
  error?: string;
}

// タグ一覧を取得
export const getTags = async (): Promise<TagsResponse> => {
  try {
    const response = await fetch(`${API_BASE}/api/tags`);
    return await response.json();
  } catch (error) {
    return { success: false, tags: [], error: 'タグ取得に失敗しました' };
  }
};

// 投稿のタグを取得
export const getPostTags = async (postId: string): Promise<TagsResponse> => {
  try {
    const response = await fetch(`${API_BASE}/api/posts/${postId}/tags`);
    return await response.json();
  } catch (error) {
    return { success: false, tags: [], error: '投稿タグ取得に失敗しました' };
  }
};

// タグ付き投稿を検索
export const getPostsByTag = async (tagId: number, params: {
  page?: number;
  limit?: number;
  postTitle?: string;
  xId?: string;
  gender?: string;
}): Promise<any> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('tagId', tagId.toString());
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.postTitle) searchParams.set('postTitle', params.postTitle);
    if (params.xId) searchParams.set('xId', params.xId);
    if (params.gender) searchParams.set('gender', params.gender);

    const response = await fetch(`${API_BASE}/api/posts/by-tag?${searchParams}`);
    return await response.json();
  } catch (error) {
    return { success: false, posts: [], pagination: {} as any, error: 'タグ検索に失敗しました' };
  }
};
