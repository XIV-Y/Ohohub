// src/utils/bookmarkUtils.ts
export interface BookmarkItem {
  id: string;
  title: string;
  xId: string | null;
  gender: 'male' | 'female';
  createdAt: string;
  bookmarkedAt: string;
}

const BOOKMARK_STORAGE_KEY = 'ohohub-bookmarks';

// ブックマーク一覧を取得
export const getBookmarks = (): BookmarkItem[] => {
  try {
    const stored = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('ブックマーク取得エラー:', error);
    return [];
  }
};

// ブックマークに追加
export const addBookmark = (post: {
  id: string;
  title: string;
  xId: string | null;
  gender: 'male' | 'female';
  createdAt: string;
}): void => {
  try {
    const bookmarks = getBookmarks();
    const bookmarkItem: BookmarkItem = {
      ...post,
      bookmarkedAt: new Date().toISOString(),
    };
    
    // 既に存在する場合は追加しない
    if (!bookmarks.some(b => b.id === post.id)) {
      bookmarks.unshift(bookmarkItem); // 最新を先頭に
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('ブックマーク追加エラー:', error);
  }
};

// ブックマークから削除
export const removeBookmark = (postId: string): void => {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== postId);
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('ブックマーク削除エラー:', error);
  }
};

// ブックマークされているかチェック
export const isBookmarked = (postId: string): boolean => {
  try {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.id === postId);
  } catch (error) {
    console.error('ブックマーク状態確認エラー:', error);
    return false;
  }
};

// ページネーション用にブックマークを取得
export const getBookmarksPaginated = (
  page: number = 1,
  limit: number = 15
) => {
  const allBookmarks = getBookmarks();
  
  // ページネーション
  const totalItems = allBookmarks.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedBookmarks = allBookmarks.slice(offset, offset + limit);
  
  return {
    bookmarks: paginatedBookmarks,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  };
};
