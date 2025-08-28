import { Card, CardContent } from '@/components/ui/card'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPost } from '../../lib/api'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import NotFound from '../errors/NotFound'

const AudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && !post) {
      fetchPost(id)
    }
  }, [id, post])

  const fetchPost = async (postId: string) => {
    const result = await getPost(postId)
    if (result.success) {
      console.log('OK3')
      setPost(result.post)
    }
    setLoading(false)
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

  console.log(progressPercentage)

  if (loading) return

  if (!post) return <NotFound />

  return (
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
  )
}

export default AudioDetail
