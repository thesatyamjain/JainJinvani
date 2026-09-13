import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  X,
  Minimize2,
  Maximize2,
  Loader2,
  Volume2,
  VolumeX,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  setupMediaSession,
  updateMediaPlaybackState,
  clearMediaSession,
  triggerHaptic,
} from '../../utils/pwaManager';

interface AudioPlayerProps {
  track: {
    title: string;
    artist?: string;
    url: string;
  } | null;
  onClose: () => void;
  autoPlay?: boolean;
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 0.75];

// Canonical scripture chanting cadence profile (52 bars simulating natural Sanskrit/Prakrit metre)
const BASE_WAVE_PATTERN = [
  0.28, 0.42, 0.36, 0.58, 0.72, 0.48, 0.32, 0.46, 0.68, 0.84,
  0.62, 0.40, 0.56, 0.82, 0.94, 0.68, 0.44, 0.32, 0.52, 0.76,
  0.88, 0.62, 0.38, 0.54, 0.72, 0.86, 0.64, 0.42, 0.58, 0.82,
  0.92, 0.74, 0.48, 0.36, 0.58, 0.84, 0.68, 0.44, 0.62, 0.78,
  0.88, 0.64, 0.42, 0.56, 0.68, 0.48, 0.34, 0.48, 0.62, 0.44,
  0.30, 0.38
];

// Persistent cache of Web Audio nodes to prevent multiple MediaElementSourceNode connections
const audioNodeCache = new WeakMap<
  HTMLAudioElement,
  {
    ctx: AudioContext;
    source: MediaElementAudioSourceNode;
    analyser: AnalyserNode;
    gain: GainNode;
  }
>();

function setupWebAudio(audio: HTMLAudioElement): {
  ctx: AudioContext;
  source: MediaElementAudioSourceNode;
  analyser: AnalyserNode;
  gain: GainNode;
} | null {
  try {
    const cached = audioNodeCache.get(audio);
    if (cached) {
      if (cached.ctx.state === 'suspended') {
        cached.ctx.resume().catch(() => {});
      }
      return cached;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128; // 64 frequency bins
    analyser.smoothingTimeConstant = 0.82;

    const gain = ctx.createGain();
    gain.gain.value = audio.muted ? 0 : 1;

    const source = ctx.createMediaElementSource(audio);
    source.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    const nodes = { ctx, source, analyser, gain };
    audioNodeCache.set(audio, nodes);

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    return nodes;
  } catch (err) {
    console.warn('Web Audio API initialized with fallback visualizer:', err);
    return null;
  }
}

export const AudioPlayer = ({ track, onClose, autoPlay = true }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreviewTime, setSeekPreviewTime] = useState(0);

  // Web Audio Analyser reference for live waveform analysis
  const [audioNodes, setAudioNodes] = useState<{
    ctx: AudioContext;
    source: MediaElementAudioSourceNode;
    analyser: AnalyserNode;
    gain: GainNode;
  } | null>(null);

  // Jump by relative seconds (-10s or +10s)
  const handleSkip = useCallback((deltaSeconds: number) => {
    triggerHaptic('light');
    if (!audioRef.current) return;
    const total = audioRef.current.duration || 0;
    const current = audioRef.current.currentTime || 0;
    const targetTime = Math.max(0, Math.min(total || 999999, current + deltaSeconds));
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  }, []);

  // Safely play audio with Web Audio context awareness
  const startPlayback = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      // Connect Web Audio API if not already active
      let currentNodes = audioNodes;
      if (!currentNodes) {
        currentNodes = setupWebAudio(audioRef.current);
        if (currentNodes) setAudioNodes(currentNodes);
      }

      if (currentNodes?.ctx && currentNodes.ctx.state === 'suspended') {
        await currentNodes.ctx.resume().catch(() => {});
      }

      setIsLoading(true);
      setHasError(false);
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      updateMediaPlaybackState('playing');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Playback interrupted or requires user gesture:', err);
        setIsPlaying(false);
      }
      setIsLoading(false);
      updateMediaPlaybackState('paused');
    }
  }, [audioNodes]);

  // Initialize track on change - ONLY runs when track URL changes
  useEffect(() => {
    if (!track?.url || !audioRef.current) return;

    setHasError(false);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);

    audioRef.current.src = track.url;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.muted = isMuted;
    audioRef.current.load();

    if (autoPlay) {
      startPlayback();
    } else {
      setIsLoading(false);
      setIsPlaying(false);
      updateMediaPlaybackState('paused');
    }
  }, [track?.url, autoPlay, startPlayback]);

  // Sync playback rate when speed pill changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync mute state across HTMLMediaElement and Web Audio GainNode
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (audioNodes?.gain && audioNodes.ctx) {
      audioNodes.gain.gain.setValueAtTime(isMuted ? 0 : 1, audioNodes.ctx.currentTime);
    }
  }, [isMuted, audioNodes]);

  // Configure Native OS Lock Screen Player
  useEffect(() => {
    if (!track) return;

    setupMediaSession({
      title: track.title,
      artist: track.artist || 'जैन जिनवाणी • नित्य स्वाध्याय',
      album: 'जैन धर्म भक्ति व स्तोत्र संग्रह',
      onPlay: () => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
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
          setCurrentTime(time);
        }
      },
      onSeekForward: () => handleSkip(10),
      onSeekBackward: () => handleSkip(-10),
    });

    return () => {
      clearMediaSession();
    };
  }, [track?.title, track?.artist, handleSkip]);

  // Sync playback rate to audio element
  const cyclePlaybackRate = () => {
    triggerHaptic('light');
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
    const nextRate = PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Toggle Play/Pause
  const togglePlay = () => {
    triggerHaptic('light');
    if (!audioRef.current) return;

    if (hasError) {
      // Retry loading on error
      if (track) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        startPlayback();
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      updateMediaPlaybackState('paused');
    } else {
      startPlayback();
    }
  };

  const toggleMute = () => {
    triggerHaptic('light');
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    if (audioNodes?.gain && audioNodes.ctx) {
      audioNodes.gain.gain.setValueAtTime(nextMuted ? 0 : 1, audioNodes.ctx.currentTime);
    }
  };

  // Native audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
    setIsLoading(false);
  };

  const handleDurationChange = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  // Waveform seeking handlers
  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekPreview = (targetTime: number) => {
    setSeekPreviewTime(targetTime);
  };

  const handleSeekEnd = (targetTime: number) => {
    setIsSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  if (!track) return null;

  const displayTime = isSeeking ? seekPreviewTime : currentTime;

  return (
    <motion.div
      layout
      initial={{ y: 24, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 24, opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed z-[60] bottom-[108px] md:bottom-[136px] pointer-events-auto ${
        isMinimized
          ? 'right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-84 max-w-sm'
          : 'inset-x-3 sm:inset-x-0 mx-auto w-auto max-w-lg'
      }`}
    >
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0e1a32]/95 via-[#081226]/95 to-[#040813]/98 border border-amber-500/30 p-3 sm:p-4 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Subtle Ambient Specular Rim Light */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleDurationChange}
          onPlay={() => {
            setIsPlaying(true);
            setIsLoading(false);
            updateMediaPlaybackState('playing');
          }}
          onPause={() => {
            setIsPlaying(false);
            setIsLoading(false);
            updateMediaPlaybackState('paused');
          }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onCanPlay={() => setIsLoading(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
            updateMediaPlaybackState('paused');
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            setIsPlaying(false);
          }}
        />

        {/* Minimized View */}
        {isMinimized ? (
          <div className="flex items-center gap-2.5">
            {/* Title */}
            <div className="flex-1 min-w-0 pl-1">
              <h4 className="text-amber-100 font-bold font-gotu text-xs sm:text-sm truncate">
                {track.title}
              </h4>
              <p className="text-amber-300/60 text-[11px] font-gotu truncate">
                {track.artist || 'जैन जिनवाणी'}
              </p>
            </div>

            {/* Mini Play / Pause */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.90 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-md shrink-0 cursor-pointer select-none"
              title={isPlaying ? 'रोकें (Pause)' : 'आरंभ करें (Play)'}
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </motion.button>

            {/* Maximize & Close */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="विस्तार करें (Expand)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                title="बंद करें (Close)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Expanded Full Devotional Audio Player */
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              {/* Title & Metadata */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-amber-100 font-bold font-gotu text-sm sm:text-base leading-tight truncate">
                  {track.title}
                </h4>
                <p className="text-amber-300/70 text-xs font-gotu truncate mt-0.5">
                  {track.artist || 'जैन जिनवाणी • नित्य स्वाध्याय'}
                </p>
              </div>

              {/* Window Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="छोटा करें (Minimize)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="बंद करें (Close)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Banner if stream failed */}
            {hasError && (
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu">
                <div className="flex items-center gap-1.5 truncate">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">ऑडियो लोड नहीं हो सका। पुनः प्रयास करें।</span>
                </div>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/30 hover:bg-rose-500/40 text-white text-[11px] font-semibold shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>पुनः प्रयास</span>
                </button>
              </div>
            )}

            {/* Interactive Realtime Waveform Scrubber in place of flat bar placeholder */}
            <div className="pt-0.5">
              <RealtimeWaveformScrubber
                analyser={audioNodes?.analyser || null}
                isPlaying={isPlaying}
                currentTime={displayTime}
                duration={duration}
                onSeekStart={handleSeekStart}
                onSeekPreview={handleSeekPreview}
                onSeekEnd={handleSeekEnd}
              />

              {/* Time Labels */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1.5 px-0.5">
                <span className="text-amber-200/90 font-medium">
                  {formatTime(displayTime)}
                </span>
                <span className="text-slate-400/80">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-0.5">
              {/* Left Utilities: Speed & Mute */}
              <div className="flex items-center gap-1.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={cyclePlaybackRate}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/5 hover:bg-amber-400/20 text-amber-300/90 hover:text-amber-200 border border-amber-400/30 transition-colors cursor-pointer select-none"
                  title="पाठ गति बदलें (Change Speed)"
                >
                  {playbackRate}x
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.90 }}
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-200 transition-colors cursor-pointer"
                  title={isMuted ? 'ध्वनि चालू करें (Unmute)' : 'म्यूट करें (Mute)'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Center Playback Controls: -10s, Play/Pause, +10s */}
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => handleSkip(-10)}
                  className="p-2 rounded-xl text-slate-300 hover:text-amber-200 hover:bg-white/10 transition-colors cursor-pointer relative"
                  title="10 सेकंड पीछे (Skip Back 10s)"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="sr-only">10s Back</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={togglePlay}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_26px_rgba(245,158,11,0.6)] transition-all cursor-pointer shrink-0 select-none"
                  title={isPlaying ? 'रोकें (Pause)' : 'आरंभ करें (Play)'}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => handleSkip(10)}
                  className="p-2 rounded-xl text-slate-300 hover:text-amber-200 hover:bg-white/10 transition-colors cursor-pointer relative"
                  title="10 सेकंड आगे (Skip Forward 10s)"
                >
                  <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="sr-only">10s Forward</span>
                </motion.button>
              </div>

              {/* Right Spacer for visual balance */}
              <div className="w-16" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface RealtimeWaveformScrubberProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeekStart: () => void;
  onSeekPreview: (time: number) => void;
  onSeekEnd: (time: number) => void;
}

/**
 * High-performance, Retina-crisp Real-time Waveform Scrubber.
 * Dynamically modulates bar heights with live audio frequency data when playing,
 * while allowing instant fluid touch/mouse scrubbing across the track.
 */
const RealtimeWaveformScrubber: React.FC<RealtimeWaveformScrubberProps> = ({
  analyser,
  isPlaying,
  currentTime,
  duration,
  onSeekStart,
  onSeekPreview,
  onSeekEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const getTimeFromPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const ratio = rect.width > 0 ? offsetX / rect.width : 0;
      return ratio * (duration || 0);
    },
    [duration]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    triggerHaptic('light');
    onSeekStart();
    const time = getTimeFromPointer(e);
    onSeekPreview(time);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const time = getTimeFromPointer(e);
    setHoverTime(time);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHoverX(Math.max(0, Math.min(rect.width, e.clientX - rect.left)));
    }

    if (isDragging) {
      onSeekPreview(time);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      const time = getTimeFromPointer(e);
      onSeekEnd(time);
      triggerHaptic('medium');
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverX(null);
      setHoverTime(null);
    }
  };

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Dynamic number of bars tailored to container width
    const numBars = Math.max(34, Math.min(64, Math.floor(rect.width / 6.8)));
    const gap = 2;
    const totalBarWidth = rect.width - gap * (numBars - 1);
    const barWidth = Math.max(1.8, totalBarWidth / numBars);

    // Retrieve real-time frequency data if active
    let freqData: Uint8Array | null = null;
    if (analyser && isPlaying) {
      freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData as any);
    }

    const progressRatio = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;
    const progressX = progressRatio * rect.width;

    for (let i = 0; i < numBars; i++) {
      const barX = i * (barWidth + gap);
      const baseProfile = BASE_WAVE_PATTERN[i % BASE_WAVE_PATTERN.length];

      let liveAmp = baseProfile * 0.42;
      if (freqData && isPlaying) {
        // Sample frequency bins across human vocal range and harmonics
        const freqIdx = Math.min(
          freqData.length - 1,
          Math.floor((i / numBars) * (freqData.length * 0.85))
        );
        const rawFreq = freqData[freqIdx] / 255;
        liveAmp = rawFreq * 0.72 + baseProfile * 0.28;
      } else if (isPlaying) {
        // Serene parametric fallback wave if analyser node is in fallback state
        const t = performance.now() / 320;
        liveAmp = baseProfile * 0.35 + (Math.sin(t + i * 0.35) * 0.5 + 0.5) * 0.35;
      }

      const maxBarHeight = rect.height - 8;
      const barHeight = Math.max(4, Math.min(maxBarHeight, liveAmp * maxBarHeight));
      const barY = (rect.height - barHeight) / 2;

      const isPlayed = barX + barWidth / 2 <= progressX;

      ctx.beginPath();
      const radius = Math.min(barWidth / 2, 2.5);
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(barX, barY, barWidth, barHeight, radius);
      } else {
        ctx.rect(barX, barY, barWidth, barHeight);
      }

      if (isPlayed) {
        const grad = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
        grad.addColorStop(0, '#fde68a'); // Warm luminous gold
        grad.addColorStop(0.5, '#f59e0b'); // Vibrant devotional amber
        grad.addColorStop(1, '#b45309'); // Deep warm bronze
        ctx.fillStyle = grad;

        // Subtle specular glow near the playhead cursor
        if (Math.abs(barX - progressX) < 18) {
          ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }
      } else {
        ctx.shadowBlur = 0;
        // Hover highlight
        if (hoverX !== null && barX <= hoverX) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.42)';
        } else {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        }
      }

      ctx.fill();
    }

    // Glowing Playhead Needle
    if (progressX >= 0 && progressX <= rect.width) {
      ctx.shadowColor = 'rgba(245, 158, 11, 0.75)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(Math.max(0, Math.min(rect.width - 2.5, progressX - 1.25)), 2, 2.5, rect.height - 4, 1.25);
      } else {
        ctx.rect(progressX - 1, 2, 2, rect.height - 4);
      }
      ctx.fill();
    }

    ctx.restore();
  }, [analyser, isPlaying, currentTime, duration, hoverX]);

  // High-performance animation frame loop: runs at 60fps when playing, sleeps when paused
  useEffect(() => {
    let animId: number | null = null;
    if (isPlaying) {
      const loop = () => {
        drawFrame();
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    } else {
      drawFrame();
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, drawFrame]);

  // Responsive redraw on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => drawFrame());
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-10 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-950/50 border border-amber-500/25 p-1 backdrop-blur-md cursor-pointer select-none shadow-inner overflow-visible transition-colors hover:border-amber-400/40"
      title="ऑडियो वेवफॉर्म - आगे या पीछे करने हेतु स्पर्श करें"
    >
      <canvas ref={canvasRef} className="w-full h-full block rounded-lg pointer-events-none" />

      {/* Floating Hover Time Preview Badge */}
      {hoverX !== null && hoverTime !== null && (
        <div
          style={{ left: hoverX }}
          className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono text-[10px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none z-20 whitespace-nowrap"
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
