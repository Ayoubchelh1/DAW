import { Artist } from "../interfaces/artist/artist";

const countries: string[] = [
    "Spain",
    "France",
    "United Kingdom",
    "United States"
];

export function isValidArtist(artist: Artist): boolean {
    if (!artist || typeof artist.artistName !== "string" || typeof artist.realName !== "string" || typeof artist.country !== "string") {
        return false;
    }

    return artist.artistName.trim().length > 0
        && artist.realName.trim().length > 0
        && countries.find((country: string) => country.toLowerCase() === artist.country.trim().replace(/\s+/g, " ").toLowerCase()) !== undefined;
}

export function getCanonicalCountry(country: string): string {
    return countries.find((countryName: string) => countryName.toLowerCase() === country.trim().replace(/\s+/g, " ").toLowerCase()) as string;
}