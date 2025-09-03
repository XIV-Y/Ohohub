// src/pages/audio/Detaile.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPost } from '../../lib/api'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import NotFound from '../errors/NotFound'
import { Heart, Bookmark, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
} from '@/utils/bookmarkUtils'

const AudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(12) // ダミーデータ
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)

  useEffect(() => {
    if (id && !post) {
      fetchPost(id)
    }
  }, [id, post])

  useEffect(() => {
    if (post) {
      // ブックマーク状態を確認
      setIsBookmarkedState(isBookmarked(post.id))
    }
  }, [post])

  const fetchPost = async (postId: string) => {
    const result = await getPost(postId)
    if (result.success) {
      console.log('投稿データ:', result.post)
      console.log('タグデータ:', result.post.tags)
      setPost(result.post)
    }
    setLoading(false)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    if (!post) return

    try {
      if (isBookmarkedState) {
        removeBookmark(post.id)
        setIsBookmarkedState(false)
      } else {
        addBookmark({
          id: post.id,
          title: post.title,
          xId: post.xId,
          gender: post.gender,
          createdAt: post.createdAt,
        })
        setIsBookmarkedState(true)
      }
    } catch (error) {
      console.error('ブックマーク操作エラー:', error)
      alert('ブックマーク操作に失敗しました')
    }
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: `${post.title} - 音声投稿をシェア`,
          url: window.location.href,
        })
      } catch (error) {
        navigator.clipboard.writeText(window.location.href)
        alert('URLをクリップボードにコピーしました')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('URLをクリップボードにコピーしました')
    }
  }

  const handleTagClick = (tagId: number) => {
    navigate(`/audio?tagId=${tagId}`)
  }

  const formatPostDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
  } = useAudioPlayer(post)

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (loading) return

  if (!post) return <NotFound />

  return (
    <div className="space-y-2">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-6">
            <audio ref={audioRef} src={post.audioUrl} preload="metadata" />

            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {post.xId ? `@${post.xId}` : '名無しのオホゴエニスト'}
                </p>
              </div>

              <div className="text-muted-foreground flex justify-between text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <Slider
                value={[progressPercentage]}
                onValueChange={(value) => seek(value[0])}
                max={100}
                step={0.1}
                className="w-full"
              />

              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={togglePlayPause}
                  size="icon"
                  className="h-12 w-12"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="ml-1 h-6 w-6 text-white" />
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-8 w-8"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={(value) => changeVolume(value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <span className="text-muted-foreground min-w-[3ch] text-sm">
                  {isMuted ? 0 : volume}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 pt-1">
        <CardContent className="px-6 py-3">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
              <div>
                <div>300再生</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={`cursor-pointer text-white transition-colors hover:bg-current hover:text-current hover:opacity-100 hover:shadow-none ${isLiked ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                >
                  <Heart
                    className={`mr-1 h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                  />
                  {likeCount}いいね
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`cursor-pointer text-white transition-colors hover:bg-current hover:text-current hover:opacity-100 hover:shadow-none ${isBookmarkedState ? 'border-blue-200 bg-blue-50 text-blue-600' : ''}`}
                >
                  <Bookmark
                    className={`mr-1 h-4 w-4 ${isBookmarkedState ? 'fill-current' : ''}`}
                  />
                  {isBookmarkedState ? 'ブックマーク済み' : 'ブックマーク'}
                </Button>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-1 h-4 w-4" />
                  シェア
                </Button>
              </div>
            </div>

            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="space-y-4 text-center">
                <h4 className="text-muted-foreground text-sm font-medium">
                  タグ
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {post.tags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="cursor-pointer text-sm transition-colors hover:bg-gray-200"
                      onClick={() => handleTagClick(tag.id)}
                    >
                      # {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <p className="text-muted-foreground text-sm">
                {formatPostDate(post.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AudioDetail
