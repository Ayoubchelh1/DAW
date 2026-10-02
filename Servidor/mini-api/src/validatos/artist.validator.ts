import { Artist } from "../interfaces/artist/artist";
import { COUNTRIES, MAXARTISTNAME, MAXREALNAME } from "../interfaces/artist/artist.constants";

export function isValidArtist(artist: Artist): boolean | string | undefined {
    if (!artist.artistName || !artist.realName || !artist.country) {
        return false;
    }

    const artistNameLength: number = artist.artistName.trim().replace(/\s+/g, " ").length;
    const realNameLength: number = artist.realName.trim().replace(/\s+/g, " ").length;

    return artistNameLength > 0
        && artistNameLength <= MAXARTISTNAME
        && realNameLength > 0
        && realNameLength <= MAXREALNAME
        && COUNTRIES.find((p: string) => p.toLowerCase() === artist.country.trim().replace(/\s+/g, " ").toLowerCase()) !== undefined;
}

export function getCanonicalCountry(country: string): string {
    return COUNTRIES.find((p: string) => p.toLowerCase() === country.trim().replace(/\s+/g, " ").toLowerCase()) as string;
}