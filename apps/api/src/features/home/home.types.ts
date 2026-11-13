import { HomeConfig } from './home.schema.js';

export type { HomeConfig };

export interface PublicHomeResponse {
    config: HomeConfig;
    hero: any;
    platinumArtists: any[];
    newArtists: any[];
    categories: any[];
    spotlights: any;
    events: any[];
    risingArtists: any[];
    venues: any[];
    faqs: any[];
    footer: any;
}
