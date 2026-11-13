import { ArtistFormData } from './validators/artist-form';

export interface CompletenessResult {
    score: number;
    tip: string;
}

export function calculateCompleteness(data: Partial<ArtistFormData>): CompletenessResult {
    let score = 0;
    const missingTips: { weight: number; tip: string }[] = [];

    // 1. Basic Info (20%)
    const hasBasic =
        Boolean(data.name && data.name.trim().length >= 2) &&
        Boolean(data.slug && data.slug.trim().length >= 2) &&
        Boolean(data.photoUrl) &&
        Boolean(data.city) &&
        Boolean(data.state) &&
        Boolean(data.artistClass);

    if (hasBasic) {
        score += 20;
    } else {
        missingTips.push({ weight: 20, tip: 'Complete Basic details and profile photo' });
    }

    // 2. About (15%)
    const bioLen = (data.bio || '').trim().length;
    if (bioLen >= 100) {
        score += 15;
    } else if (bioLen > 0) {
        score += 7;
        missingTips.push({ weight: 8, tip: 'Expand biography to at least 100 characters' });
    } else {
        missingTips.push({ weight: 15, tip: 'Add artist biography' });
    }

    // 3. Categories (10%)
    const catCount = (data.categories || []).length;
    if (catCount >= 1) {
        score += 10;
    } else {
        missingTips.push({ weight: 10, tip: 'Select at least 1 primary category' });
    }

    // 4. Social Links (10%)
    const hasSocial = Boolean(
        data.instagram ||
        data.youtube ||
        data.facebook ||
        data.spotify ||
        data.x ||
        data.website ||
        data.imdbUrl,
    );
    if (hasSocial) {
        score += 10;
    } else {
        missingTips.push({ weight: 10, tip: 'Add at least one social media link' });
    }

    // 5. Fanbase (10%)
    const totalFanbase =
        Number(data.fanbaseSpotify || 0) +
        Number(data.fanbaseYouTube || 0) +
        Number(data.fanbaseInstagram || 0) +
        Number(data.fanbaseFacebook || 0) +
        Number(data.fanbaseDeezer || 0) +
        Number(data.fanbaseSoundCloud || 0) +
        Number(data.fanbaseTikTok || 0);

    if (totalFanbase > 0) {
        score += 10;
    } else {
        missingTips.push({ weight: 10, tip: 'Add fanbase counts to show audience reach' });
    }

    // 6. Gallery (15%)
    const galCount = (data.gallery || []).length;
    if (galCount >= 3) {
        score += 15;
    } else if (galCount >= 1) {
        score += 8;
        missingTips.push({
            weight: 7,
            tip: 'Add 2 more gallery photos to reach full gallery score',
        });
    } else {
        missingTips.push({ weight: 15, tip: 'Add photos to the gallery (minimum 3 recommended)' });
    }

    // 7. Videos (5%)
    const hasVideos = Boolean(
        data.videos && data.videos.length > 0 && data.videos.some((v) => v.url),
    );
    if (hasVideos) {
        score += 5;
    } else {
        missingTips.push({ weight: 5, tip: 'Add at least one YouTube video link' });
    }

    // 8. Campaigns / Awards (5%)
    const hasWork = Boolean(
        (data.campaigns && data.campaigns.length > 0) || (data.awards && data.awards.length > 0),
    );
    if (hasWork) {
        score += 5;
    } else {
        missingTips.push({ weight: 5, tip: 'Add previous campaigns or awards' });
    }

    // 9. SEO (10%)
    const hasSeo = Boolean(data.metaTitle && data.metaDescription);
    if (hasSeo) {
        score += 10;
    } else {
        missingTips.push({ weight: 10, tip: 'Fill meta title and description for search engines' });
    }

    // Sort tips by potential gain
    missingTips.sort((a, b) => b.weight - a.weight);

    const highestTip = missingTips[0];
    const targetPct = Math.min(100, score + (highestTip ? highestTip.weight : 0));
    const tipText = highestTip
        ? `Profile is ${score}% complete — ${highestTip.tip} to reach ${targetPct}%`
        : 'Profile is 100% complete and ready for prime showcase!';

    return {
        score: Math.min(100, score),
        tip: tipText,
    };
}
