import { randomUUID } from "crypto";
import { artists } from "../data/artist/artist";
import { Artist } from "../interfaces/artist/artist";
import { ArtistBD } from "../interfaces/artist/artistBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { ArtistInvalidData } from "../interfaces/error/artistInvalidData";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { getCanonicalCountry, isValidArtist } from "../validatos/artist.validator";
import { ConnectionPool, IResult } from "mssql";
import sql from "mssql";
import { getConnection } from "../config/database";
import { TrackBD } from "../interfaces/track/trackBD";

export async function getAllArtists(): Promise<ArtistBD[]> {
    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();

    const queryText: string = "select * from Artist";

    const result: IResult<ArtistBD[]> = await request.query(queryText);
    console.log("artistes:", result);
    return result.recordset;

}

export function getArtistById(idArtist: string): ArtistBD | undefined {
    return artists.find((artist: ArtistBD) => artist.id === idArtist);
}

export function createArtist(artist: Artist): CreateSuccessService | ArtistInvalidData {
    if (!isValidArtist(artist)) {
        return { success: false, code: 400, message: "invalid data or country" };
    }

    const artistRecord: ArtistBD = {
        id: randomUUID(),
        artistName: artist.artistName.trim().replace(/\s+/g, " "),
        realName: artist.realName.trim().replace(/\s+/g, " "),
        country: getCanonicalCountry(artist.country)
    };

    return { success: true, code: 201, data: 1 };
}

export function updateArtist(idArtist: string, artist: Artist): UpdateSuccessService<ArtistBD> | ArtistInvalidData {
    const artistIndex: number = artists.findIndex((artist: ArtistBD) => artist.id === idArtist);
    if (artistIndex === -1) {
        return { success: false, code: 404, message: "Artist not found" };
    }

    if (!isValidArtist(artist)) {
        return { success: false, code: 400, message: "invalid data or country" };
    }

    const updatedArtist: ArtistBD = {
        id: idArtist,
        artistName: artist.artistName.trim().replace(/\s+/g, " "),
        realName: artist.realName.trim().replace(/\s+/g, " "),
        country: getCanonicalCountry(artist.country)
    };

    return { success: true, code: 200, data: 1 };
}

export function deleteArtist(idArtist: string): DeleteSuccessService | ArtistInvalidData {
    const artistIndex: number = artists.findIndex((artist: ArtistBD) => artist.id === idArtist);

    if (artistIndex === -1) {
        return { success: false, code: 404, message: "Artist not found" };
    }

    return { success: true, code: 204 };
}