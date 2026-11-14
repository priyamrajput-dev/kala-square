import { ArtistFormData } from './validators/artist-form';

export interface CompletenessResult {
    score: number;
    tip: string;
}

/**
 * Exact completeness calculation from Kalasquare_Home_Page_Manager_2.html:
 * function completeness() {
 *   var soc = ['ig', 'yt', 'fb', 'x', 'spotify', 'imdb'].some(function (k) { return AF[k]; });
 *   var chk = [AF.name, AF.photo, AF.cats.length, AF.city, AF.tagline, AF.bio, AF.exp, AF.projects, AF.shows, AF.followers, AF.spec.length, AF.gallery.length >= 3,
 *     AF.videos.some(function (v) { return v.u; }), AF.clips.some(function (v) { return v.u; }), AF.songs.some(function (v) { return v.u; }), AF.camps.length, AF.awards.length, soc, AF.phone];
 *   return Math.round(chk.filter(Boolean).length / chk.length * 100);
 * }
 */
export function calculateCompleteness(data: Partial<ArtistFormData>): CompletenessResult {
    const soc = Boolean(
        data.socialInstagram ||
        data.socialYouTube ||
        data.socialFacebook ||
        data.socialX ||
        data.socialSpotify ||
        data.imdbUrl ||
        (data as any).instagram ||
        (data as any).youtube ||
        (data as any).facebook ||
        (data as any).x ||
        (data as any).spotify
    );

    const chk = [
        Boolean(data.name && data.name.trim().length > 0),
        Boolean(data.photoUrl),
        Boolean(data.categories && data.categories.length > 0),
        Boolean(data.city && data.city.trim().length > 0),
        Boolean(data.tagline && data.tagline.trim().length > 0),
        Boolean(data.bio && data.bio.trim().length > 0),
        Boolean(data.experienceYears && String(data.experienceYears).trim().length > 0),
        Boolean(data.projectsCount && String(data.projectsCount).trim().length > 0),
        Boolean(data.liveShowsCount && String(data.liveShowsCount).trim().length > 0),
        Boolean(data.totalFollowersLabel && String(data.totalFollowersLabel).trim().length > 0),
        Boolean(
            (Array.isArray(data.specializations) && data.specializations.length > 0) ||
            (typeof data.specializations === 'string' && data.specializations.trim().length > 0)
        ),
        Boolean(data.gallery && data.gallery.length >= 3),
        Boolean(data.videos && data.videos.some((v: any) => v.url && v.url.trim().length > 0)),
        Boolean(data.clips && data.clips.some((c: any) => c.url && c.url.trim().length > 0)),
        Boolean((data as any).songs && (data as any).songs.some((s: any) => s.url && s.url.trim().length > 0)),
        Boolean(data.campaigns && data.campaigns.length > 0),
        Boolean(data.awards && data.awards.length > 0),
        soc,
        Boolean(data.phone && data.phone.trim().length > 0),
    ];

    const filledCount = chk.filter(Boolean).length;
    const score = Math.round((filledCount / chk.length) * 100);

    const tip = score === 100
        ? 'Profile is 100% complete and ready for prime showcase!'
        : score === 0
        ? 'Profile completeness 0% — start by adding basic details'
        : `Profile is ${score}% complete`;

    return {
        score,
        tip,
    };
}
