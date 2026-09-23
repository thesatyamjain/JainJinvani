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

export interface AudioTimestamp {
  verseIndex: number;
  start: number;
  end?: number;
  label?: string;
}

export interface ContentAudioTrack {
  title: string;
  artist?: string;
  url: string;
  timestamps?: AudioTimestamp[];
}

// Canonical verse timestamp mappings for synchronized read-along
export const CANONICAL_TIMESTAMPS: Record<string, AudioTimestamp[]> = {
  'namokar-mantra': [
    { verseIndex: 0, start: 0, end: 8, label: 'नमो अरिहंताणं' },
    { verseIndex: 1, start: 8, end: 15, label: 'नमो सिद्धाणं' },
    { verseIndex: 2, start: 15, end: 22, label: 'नमो आइरियाणं' },
    { verseIndex: 3, start: 22, end: 30, label: 'नमो उवज्झायाणं' },
    { verseIndex: 4, start: 30, end: 39, label: 'नमो लोए सव्वसाहूणं' },
    { verseIndex: 5, start: 39, end: 55, label: 'एसोपञ्चणमोक्कारो' },
  ],
  'aarti-mangal': [
    { verseIndex: 0, start: 0, end: 18, label: 'दीप मंगलीक' },
    { verseIndex: 1, start: 18, end: 42, label: 'प्रथम आरति' },
    { verseIndex: 2, start: 42, end: 68, label: 'दूजी आरति' },
    { verseIndex: 3, start: 68, end: 94, label: 'तीजी आरति' },
    { verseIndex: 4, start: 94, end: 120, label: 'चौथी आरति' },
    { verseIndex: 5, start: 120, end: 150, label: 'पांचवी आरति' },
  ],
  'jain-aarti': [
    { verseIndex: 0, start: 0, end: 18, label: 'दीप मंगलीक' },
    { verseIndex: 1, start: 18, end: 42, label: 'प्रथम आरति' },
    { verseIndex: 2, start: 42, end: 68, label: 'दूजी आरति' },
    { verseIndex: 3, start: 68, end: 94, label: 'तीजी आरति' },
    { verseIndex: 4, start: 94, end: 120, label: 'चौथी आरति' },
    { verseIndex: 5, start: 120, end: 150, label: 'पांचवी आरति' },
  ],
};

/**
 * Resolves whether a scripture has an associated audio track available for read-along playback.
 * Checks item-level audioUrl / audioTimestamps first, then falls back to built-in tracks.
 */
export function getContentAudioTrack(
  contentId?: string,
  item?: { audioUrl?: string; audio?: string; title?: string; author?: string; artist?: string; audioTimestamps?: AudioTimestamp[]; [key: string]: any }
): ContentAudioTrack | null {
  const cleanId = (contentId || (item && item.id) || '').toLowerCase().replace(/_/g, '-');

  // 1. Direct item audioUrl
  if (item?.audioUrl || item?.audio) {
    const rawUrl = item.audioUrl || item.audio || '';
    const resolvedUrl = rawUrl.startsWith('/') && R2_BASE_URL ? `${R2_BASE_URL}${rawUrl}` : rawUrl;
    return {
      title: item.title || 'ऑडियो पाठ',
      artist: item.author || item.artist || 'पारंपरिक जैन स्वर',
      url: resolvedUrl,
      timestamps: item.audioTimestamps || CANONICAL_TIMESTAMPS[cleanId],
    };
  }

  if (!cleanId) return null;

  let track: MediaTrack | null = null;
  if (cleanId.includes('bhaktamar')) {
    track = MEDIA_TRACKS.BHAKTAMAR_STOTRA;
  } else if (cleanId.includes('namokar') || cleanId.includes('navkar')) {
    track = MEDIA_TRACKS.NAMOKAR_MANTRA;
  } else if (/(^|[-_])(aarti|arti)([-_]|$)/.test(cleanId)) {
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
    timestamps: CANONICAL_TIMESTAMPS[cleanId] || (track.id ? CANONICAL_TIMESTAMPS[track.id] : undefined),
  };
}
