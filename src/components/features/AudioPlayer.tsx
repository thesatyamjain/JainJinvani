import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Minimize2, Maximize2 } from 'lucide-react';
import { GlassCard } from '../layout/GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import { setupMediaSession, updateMediaPlaybackState, clearMediaSession, triggerHaptic } from '../../utils/pwaManager';

interface AudioPlayerProps {
  track: {
    title: string;
    artist?: string;
    url: string;
  } | null;
  onClose: () => void;
  autoPlay?: boolean;
}

export const AudioPlayer = ({ track, onClose, autoPlay = true }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track.url;
      if (autoPlay) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
          updateMediaPlaybackState('paused');
        });
        setIsPlaying(true);
        updateMediaPlaybackState('playing');
      } else {
        setIsPlaying(false);
        updateMediaPlaybackState('paused');
      }

      // Configure Native OS Lock Screen Player
      setupMediaSession({
        title: track.title,
        artist: track.artist || 'जैन जिनवाणी • नित्य स्वाध्याय',
        album: 'जैन धर्म भक्ति व स्तोत्र संग्रह',
        onPlay: () => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            updateMediaPlaybackState('playing');
          }
        },
        onPause: () => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            updateMediaPlaybackState('paused');
          }
        },
        onSeek: (time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress((time / (audioRef.current.duration || 1)) * 100);
          }
        },
      });
    }

    return () => {
      clearMediaSession();
    };
  }, [track, autoPlay]);

  const togglePlay = () => {
    triggerHaptic('light');
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        updateMediaPlaybackState('paused');
      } else {
        audioRef.current.play();
        updateMediaPlaybackState('playing');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
      setDuration(total);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (Number(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(Number(e.target.value));
    }
  };

  if (!track) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={`fixed ${isMinimized ? 'bottom-24 right-6 w-72' : 'bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg'} z-50 transition-all duration-300`}
    >
      <GlassCard className="p-4 backdrop-blur-2xl bg-[#050a14]/80 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        />

        <div className="flex items-center gap-4">
          {/* Album Art / Icon */}
          <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-600/20 flex items-center justify-center border border-white/10 ${isMinimized ? 'w-10 h-10' : 'w-14 h-14'}`}>
            <MusicVisualizer isPlaying={isPlaying} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold truncate font-gotu text-sm md:text-base">
              {track.title}
            </h4>
            <p className="text-blue-200/50 text-xs truncate font-gotu">
              {track.artist || 'Jain Jinvani Audio'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isMinimized && (
              <>
                <button className="p-2 text-blue-200 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
              </>
            )}

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {!isMinimized && (
              <>
                <button className="p-2 text-blue-200 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Window Controls */}
          <div className="flex flex-col gap-1 ml-2">
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/30 hover:text-white transition-colors">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar (Only when not minimized) */}
        {!isMinimized && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[10px] text-blue-200/50 font-mono w-8 text-right">
              {formatTime(audioRef.current?.currentTime || 0)}
            </span>
            <div className="flex-1 relative h-1 bg-white/10 rounded-full group cursor-pointer">
              <div
                className="absolute left-0 top-0 h-full bg-amber-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-blue-200/50 font-mono w-8">
              {formatTime(duration)}
            </span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

// Helper for visualizer bars
const MusicVisualizer = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end gap-0.5 h-4">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`w-1 bg-amber-400/80 rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
        style={{
          height: isPlaying ? `${Math.random() * 100}%` : '20%',
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
  </div>
);

const formatTime = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
