/**
 * Media Configuration for Jain Jinvani
 * Powered by Cloudflare R2 object storage with zero egress bandwidth charges.
 * 
 * To stream from your own Cloudflare R2 bucket, set `VITE_R2_MEDIA_URL` in `.env` or Cloudflare Pages environment variables
 * (e.g. `VITE_R2_MEDIA_URL=https://media.jainjinvani.org` or `https://pub-xxxxxx.r2.dev`).
 * If not set, it safely uses verified fallback URLs so audio continues playing without interruption.
 */

export interface MediaTrack {
  id: string;
  title: string;
  artist?: string;
  r2Path: string;
  fallbackUrl: string;
}

export const R2_BASE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_R2_MEDIA_URL) ||
  ''
).replace(/\/+$/, '');

export const MEDIA_TRACKS: Record<string, MediaTrack> = {
  NAMOKAR_MANTRA: {
    id: 'namokar-mantra',
    title: 'णमोकार महामंत्र (धुन)',
    artist: 'पारंपरिक जैन स्वर',
    r2Path: '/audio/Namokar_Mantra.mp3',
    fallbackUrl: '/audio/Namokar_Mantra.mp3',
  },
  SAMAYIK_BELL: {
    id: 'samayik-bell',
    title: 'सामायिक पूर्णता घंटिका',
    artist: 'मंदिर घंटिका',
    r2Path: '/audio/temple_bell.mp3',
    fallbackUrl: '/audio/temple_bell.mp3',
  },
  BHAKTAMAR_STOTRA: {
    id: 'bhaktamar-stotra',
    title: 'श्री भक्तामर स्तोत्र (संस्कृत)',
    artist: 'पूज्य मुनि श्री / विदुषी स्वर',
    r2Path: '/audio/Bhaktamar_Stotra.mp3',
    fallbackUrl: '/audio/Bhaktamar_Stotra.mp3',
  },
  AARTI_MANGAL: {
    id: 'aarti-mangal',
    title: 'पंच परमेष्ठी मंगल आरती',
    artist: 'जैन समाज',
    r2Path: '/audio/Panch_Parmeshthi_Aarti.mp3',
    fallbackUrl: '/audio/Panch_Parmeshthi_Aarti.mp3',
  },
};

/**
 * Get resolved streaming audio URL.
 * Prefers Cloudflare R2 bucket URL when configured, otherwise uses fallback.
 */
export function getMediaUrl(trackKey: keyof typeof MEDIA_TRACKS): string {
  const track = MEDIA_TRACKS[trackKey];
  if (!track) return '';

  if (R2_BASE_URL) {
    return `${R2_BASE_URL}${track.r2Path}`;
  }

  return track.fallbackUrl || track.r2Path;
}

/**
 * Resolves whether a scripture has an associated audio track available for read-along playback.
 */
export function getContentAudioTrack(contentId?: string): { title: string; artist?: string; url: string } | null {
  if (!contentId) return null;
  const cleanId = contentId.toLowerCase().replace(/_/g, '-');

  let track: MediaTrack | null = null;
  if (cleanId.includes('bhaktamar')) {
    track = MEDIA_TRACKS.BHAKTAMAR_STOTRA;
  } else if (cleanId.includes('namokar') || cleanId.includes('navkar')) {
    track = MEDIA_TRACKS.NAMOKAR_MANTRA;
  } else if (cleanId.includes('aarti') || cleanId.includes('arti')) {
    track = MEDIA_TRACKS.AARTI_MANGAL;
  }

  if (!track) return null;

  const url = R2_BASE_URL
    ? `${R2_BASE_URL}${track.r2Path}`
    : (track.fallbackUrl || track.r2Path);

  if (!url) return null;

  return {
    title: track.title,
    artist: track.artist,
    url,
  };
}
