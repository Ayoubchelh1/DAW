import { randomUUID } from "crypto";
import { artists } from "../data/artist/artist";
import { Artist } from "../interfaces/artist/artist";
import { ArtistBD } from "../interfaces/artist/artistBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ArtistInvalidData } from "../interfaces/error/artistInvalidData";
import { getCanonicalCountry, isValidArtist } from "../validatos/artist.validator";

export function getAllArtists(): ArtistBD[] {
    return artists;
}

export function getArtistById(idArtist: string): ArtistBD | undefined {
    return artists.find((artist: ArtistBD) => artist.id === idArtist);
}

export function createArtist(artist: Artist): CreateSuccessService<ArtistBD> | ArtistInvalidData {
    if (!isValidArtist(artist)) {
        return { success: false, code: 400, message: "invalid data or country" };
    }

    const artistRecord: ArtistBD = {
        id: randomUUID(),
        artistName: artist.artistName.trim().replace(/\s+/g, " "),
        realName: artist.realName.trim().replace(/\s+/g, " "),
        country: getCanonicalCountry(artist.country)
    };

    return { success: true, code: 201, data: artistRecord };
}