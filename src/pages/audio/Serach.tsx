// src/pages/audio/Serach.tsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPosts, getTags, type Post, type Tag } from '../../lib/api'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

const AudioSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // 検索フィルター（フォーム入力値）
  const [searchTitle, setSearchTitle] = useState('')
  const [searchXId, setSearchXId] = useState('')
  const [searchGender, setSearchGender] = useState('')
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null)

  // 実際に送信される検索条件
  const [appliedFilters, setAppliedFilters] = useState({
    postTitle: '',
    xId: '',
    gender: '',
    tagId: null as number | null,
  })

  // 初回読み込み時にURLパラメータから状態を復元
  useEffect(() => {
    const pageParam = searchParams.get('page')
    const titleParam = searchParams.get('title') || ''
    const xIdParam = searchParams.get('xId') || ''
    const genderParam = searchParams.get('gender') || ''
    const tagIdParam = searchParams.get('tagId')

    // フォーム入力値を設定
    setSearchTitle(titleParam)
    setSearchXId(xIdParam)
    setSearchGender(genderParam === 'all' ? '' : genderParam)
    setSelectedTagId(tagIdParam ? parseInt(tagIdParam, 10) : null)

    // 適用された検索条件を設定
    const filters = {
      postTitle: titleParam,
      xId: xIdParam,
      gender: genderParam === 'all' ? '' : genderParam,
      tagId: tagIdParam ? parseInt(tagIdParam, 10) : null,
    }
    setAppliedFilters(filters)

    // ページを設定
    const page = pageParam ? parseInt(pageParam, 10) : 1
    setCurrentPage(page)

    fetchTags()
    fetchPosts(page, filters)
  }, [])

  // タグデータを取得
  const fetchTags = async () => {
    const result = await getTags()
    if (result.success) {
      setTags(result.tags)
    }
  }

  const fetchPosts = async (page: number, filters = appliedFilters) => {
    setLoading(true)
    const result = await getPosts({
      page,
      ...filters,
    })

    if (result.success) {
      setPosts(result.posts)
      setCurrentPage(result.pagination.currentPage)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    }
    setLoading(false)
  }

  // URLパラメータを更新する関数
  const updateUrlParams = (page: number, filters: typeof appliedFilters) => {
    const params = new URLSearchParams()

    if (page > 1) {
      params.set('page', page.toString())
    }
    if (filters.postTitle) {
      params.set('title', filters.postTitle)
    }
    if (filters.xId) {
      params.set('xId', filters.xId)
    }
    if (filters.gender) {
      params.set('gender', filters.gender)
    }
    if (filters.tagId) {
      params.set('tagId', filters.tagId.toString())
    }

    // URLを更新
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    navigate(`/audio${newUrl}`, { replace: true })
  }

  const handleSearch = () => {
    const newFilters = {
      postTitle: searchTitle,
      xId: searchXId,
      gender: searchGender === 'all' ? '' : searchGender,
      tagId: selectedTagId,
    }

    setAppliedFilters(newFilters)
    setCurrentPage(1)
    updateUrlParams(1, newFilters)
    fetchPosts(1, newFilters)
  }

  const handleClearSearch = () => {
    setSearchTitle('')
    setSearchXId('')
    setSearchGender('')
    setSelectedTagId(null)

    const clearedFilters = {
      postTitle: '',
      xId: '',
      gender: '',
      tagId: null as number | null,
    }

    setAppliedFilters(clearedFilters)
    setCurrentPage(1)
    navigate('/audio', { replace: true })
    fetchPosts(1, clearedFilters)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateUrlParams(newPage, appliedFilters)
    fetchPosts(newPage, appliedFilters)
  }

  const handleTagSelect = (tagId: number) => {
    setSelectedTagId(selectedTagId === tagId ? null : tagId)
  }

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInMs = now.getTime() - postDate.getTime()

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 60) {
      if (diffInMinutes <= 1) return '1分前'
      return `${diffInMinutes}分前`
    }

    if (diffInHours < 24) {
      return `${diffInHours}時間前`
    }

    if (diffInDays < 7) return `${diffInDays}日前`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}ヶ月前`
    return `${Math.floor(diffInDays / 365)}年前`
  }

  const getGenderBorderColor = (gender: 'male' | 'female'): string => {
    return gender === 'male'
      ? 'border-l-4 border-l-blue-500'
      : 'border-l-4 border-l-pink-500'
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const showPages = 5
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages, startPage + showPages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      )
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 pb-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">音声投稿一覧</h1>
      </div>

      {/* 検索フィルター */}
      <Card>
        <CardContent className="px-6 py-1">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">タイトル</label>
              <Input
                placeholder="タイトルで検索"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Xアカウント
              </label>
              <Input
                placeholder="@なしで入力"
                value={searchXId}
                onChange={(e) => setSearchXId(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">性別</label>
              <Select
                value={searchGender || 'all'}
                onValueChange={setSearchGender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="mb-2 block text-sm font-medium">タグ</label>
              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border p-3">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTagId === tag.id ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      selectedTagId === tag.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <Button
                onClick={handleSearch}
                className="bg-primary-gradient flex-1"
              >
                <Search className="mr-2 h-4 w-4 text-white" />
                <p className="text-white">検索</p>
              </Button>
              <Button variant="outline" onClick={handleClearSearch}>
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 投稿一覧 */}
      {loading ? (
        <div className="py-8 text-center">読み込み中...</div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          投稿が見つかりませんでした
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.id} to={`/audio/${post.id}`}>
              <Card
                className={`w-full cursor-pointer transition-shadow hover:shadow-md ${getGenderBorderColor(post.gender)}`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* メイン情報 */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-2 truncate text-base font-semibold lg:text-lg">
                          {post.title}
                        </h3>
                        <div className="text-muted-foreground flex items-center text-sm">
                          <span>
                            {post.xId
                              ? `@${post.xId}`
                              : '名無しのオホゴエニスト'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* タグ表示 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag: any) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            # {tag.name}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* 投稿日時 */}
                    <div className="flex justify-end">
                      <p className="text-muted-foreground text-xs">
                        {formatRelativeTime(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {renderPagination()}
    </div>
  )
}

export default AudioSearch
