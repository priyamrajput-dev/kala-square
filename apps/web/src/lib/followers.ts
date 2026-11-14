export function parseFollowerCount(
  label?: string | number | null,
  fanbaseObj?: Record<string, any>
): number {
  if (label !== undefined && label !== null && String(label).trim() !== '') {
    const raw = String(label).trim().toLowerCase();
    if (raw.endsWith('m')) {
      const val = parseFloat(raw.replace('m', ''));
      return isNaN(val) ? 0 : Math.round(val * 1000000);
    }
    if (raw.endsWith('k')) {
      const val = parseFloat(raw.replace('k', ''));
      return isNaN(val) ? 0 : Math.round(val * 1000);
    }
    const val = parseInt(raw.replace(/[^\d]/g, ''), 10);
    return isNaN(val) ? 0 : val;
  }

  // Sum fanbase reach across platforms if explicit label was not entered
  if (fanbaseObj) {
    let sum = 0;
    const keys = [
      'fanbaseSpotify',
      'fanbaseYouTube',
      'fanbaseInstagram',
      'fanbaseFacebook',
      'fanbaseDeezer',
      'fanbaseSoundCloud',
      'fanbaseTikTok',
    ];
    for (const k of keys) {
      const v = fanbaseObj[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        const raw = String(v).trim().toLowerCase();
        if (raw.endsWith('m')) {
          const num = parseFloat(raw.replace('m', ''));
          if (!isNaN(num)) sum += Math.round(num * 1000000);
        } else if (raw.endsWith('k')) {
          const num = parseFloat(raw.replace('k', ''));
          if (!isNaN(num)) sum += Math.round(num * 1000);
        } else {
          const num = parseInt(raw.replace(/[^\d]/g, ''), 10);
          if (!isNaN(num)) sum += num;
        }
      }
    }
    if (sum > 0) return sum;
  }

  return 0;
}

export function formatFollowers(n: number): string {
  if (!n || n <= 0) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

