// src/pages/audio/Search.tsx
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
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getPosts, getTags, type Post, type Tag } from '../../lib/api'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

const AudioSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // 検索フィルター
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

  useEffect(() => {
    // URLパラメータから初期値を設定
    const tagId = searchParams.get('tagId')
    if (tagId) {
      const tagIdNum = parseInt(tagId)
      setSelectedTagId(tagIdNum)
      setAppliedFilters((prev) => ({ ...prev, tagId: tagIdNum }))
    }

    fetchTags()
  }, [])

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage, appliedFilters])

  const fetchTags = async () => {
    const result = await getTags()
    if (result.success) {
      setTags(result.tags)
    }
  }

  const fetchPosts = async (page: number) => {
    setLoading(true)
    const result = await getPosts({
      page,
      ...appliedFilters,
    })

    if (result.success) {
      setPosts(result.posts)
      setCurrentPage(result.pagination.currentPage)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    setAppliedFilters({
      postTitle: searchTitle,
      xId: searchXId,
      gender: searchGender,
      tagId: selectedTagId,
    })
    setCurrentPage(1)

    // URLパラメータを更新
    const newSearchParams = new URLSearchParams()
    if (selectedTagId) newSearchParams.set('tagId', selectedTagId.toString())
    setSearchParams(newSearchParams)
  }

  const handleClearSearch = () => {
    setSearchTitle('')
    setSearchXId('')
    setSearchGender('')
    setSelectedTagId(null)
    setAppliedFilters({
      postTitle: '',
      xId: '',
      gender: '',
      tagId: null,
    })
    setCurrentPage(1)
    setSearchParams(new URLSearchParams())
  }

  const handleTagSelect = (tagId: number) => {
    setSelectedTagId(tagId)
  }

  const handleTagRemove = () => {
    setSelectedTagId(null)
  }

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInMs = now.getTime() - postDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return '今日'
    if (diffInDays === 1) return '1日前'
    if (diffInDays < 7) return `${diffInDays}日前`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}ヶ月前`
    return `${Math.floor(diffInDays / 365)}年前`
  }

  const getGenderBorderColor = (gender: 'male' | 'female'): string => {
    return gender === 'male'
      ? 'border-l-5 border-l-blue-500'
      : 'border-l-5 border-l-pink-500'
  }

  const renderPagination = () => {
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
          onClick={() => setCurrentPage(i)}
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
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const selectedTag = selectedTagId
    ? tags.find((tag) => tag.id === selectedTagId)
    : null

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
              <Select value={searchGender} onValueChange={setSearchGender}>
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
                    onClick={() =>
                      selectedTagId === tag.id
                        ? handleTagRemove()
                        : handleTagSelect(tag.id)
                    }
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
            <div key={post.id} className="space-y-4">
              <Link to={`/audio/${post.id}`}>
                <Card
                  className={`w-full cursor-pointer transition-shadow hover:shadow-md ${getGenderBorderColor(post.gender)}`}
                >
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 truncate text-lg font-semibold">
                          {post.title}
                        </h3>
                        <div className="text-muted-foreground mb-2 flex items-center space-x-4 text-sm">
                          <span>
                            {post.xId
                              ? `@${post.xId}`
                              : '名無しのオホゴエニスト'}
                          </span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag: any) => (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">
                          {formatRelativeTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && <div className="space-y-4">{renderPagination()}</div>}
    </div>
  )
}

export default AudioSearch
