import { Card, CardContent } from '@/components/ui/card'
import useAudioPlayer from '@/hooks/useAudioPlayer'
import { Play, Pause, Volume2, VolumeX, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

import Header from '@/components/custom-ui/header'
import { ThemeProvider } from '@/providers/theme'
import { Link } from 'react-router-dom'

export default function Home() {
  const audioSrc = '/test.mp3'

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    stop,
    seek,
    changeVolume,
    toggleMute,
  } = useAudioPlayer()

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <audio ref={audioRef} src={audioSrc} />

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold">サンプル音声</h3>
              <p className="text-muted-foreground text-sm">アーティスト名</p>
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
                className="h-14 w-14"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="ml-1 h-6 w-6" />
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

    // <nav className="fixed bottom-0 w-full border-t border-gray-200 bg-white">
    //   <div className="mx-auto flex w-full max-w-sm">
    //     <button className="flex-1 px-2 py-3 text-center hover:bg-gray-50">
    //       <div className="mx-auto mb-1 h-6 w-6 rounded bg-gray-400"></div>
    //       <span className="text-xs text-gray-600">ホーム</span>
    //     </button>

    //     <div className="relative -top-8 flex flex-col items-center">
    //       <Link
    //         to="/audio/create"
    //         className="bg-primary-gradient block rounded-full p-4 shadow-lg transition-colors duration-200"
    //       >
    //         <Plus className="h-8 w-8 text-white" strokeWidth={2} />
    //       </Link>
    //       <span className="mt-1 text-sm text-gray-600">投稿</span>
    //     </div>

    //     <button className="flex-1 px-2 py-3 text-center hover:bg-gray-50">
    //       <div className="mx-auto mb-1 h-6 w-6 rounded bg-gray-400"></div>
    //       <span className="text-xs text-gray-600">検索</span>
    //     </button>
    //   </div>
    // </nav>
  )
}
