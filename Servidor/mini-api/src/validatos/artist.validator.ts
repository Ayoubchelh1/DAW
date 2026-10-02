import { Artist } from "../interfaces/artist/artist";

const countries: string[] = [
    "Spain",
    "France",
    "United Kingdom",
    "United States"
];

const countryNames: Map<string, string> = new Map(
    countries.map((country: string) => [country.toLowerCase(), country])
);

export function isValidArtist(artist: Artist): boolean {
    if (!artist || typeof artist.artistName !== "string" || typeof artist.realName !== "string" || typeof artist.country !== "string") {
        return false;
    }

    return artist.artistName.trim().length > 0
        && artist.realName.trim().length > 0
        && countryNames.has(artist.country.trim().replace(/\s+/g, " ").toLowerCase());
}

export function getCanonicalCountry(country: string): string {
    return countryNames.get(country.trim().replace(/\s+/g, " ").toLowerCase()) as string;
}