import { countries } from "../data/country/country";
import { Artist } from "../interfaces/artist/artist";
import { MAXARTISTNAME, MAXREALNAME } from "../interfaces/artist/artist.constants";
import { CountryBD } from "../interfaces/country/countryBD";

export function isValidArtist(artist: Artist): boolean | string | undefined {

    if (!artist) {
        return false;
    }

    if (!artist.artistName || !artist.realName || !artist.country) {
        return false;
    }

    const artistNameLength: number = artist.artistName.trim().replace(/\s+/g, " ").length;
    const realNameLength: number = artist.realName.trim().replace(/\s+/g, " ").length;

    const dadesOK: boolean = artistNameLength > 0
        && artistNameLength <= MAXARTISTNAME
        && realNameLength > 0
        && realNameLength <= MAXREALNAME

    if (!dadesOK) {
        return false;
    }

    const idCountry: string = artist.country;

    const countryOK: CountryBD | undefined = countries.find(
        (c: CountryBD) => {
            return c.id === idCountry;
        }
    )

    if (!countryOK) {
        console.log("Country no valid")
        return false;
    }
    console.log("OK")
    return true

}

export function getCanonicalCountry(country: string): string {
    return countries.find((entry: CountryBD) => entry.id === country.trim())?.id ?? "";
}