import { randomUUID } from "crypto";
import { countries } from "../data/country/country";
import { Country } from "../interfaces/country/country";
import { CountryBD } from "../interfaces/country/countryBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { isValidCountry } from "../validatos/country.validator";

export function getAllCountries(): CountryBD[] {
    return countries;
}

export function getCountryById(idCountry: string): CountryBD | undefined {
    return countries.find((country: CountryBD) => country.id === idCountry);
}

export function createCountry(country: Country): CreateSuccessService<CountryBD> | ErrorService {
    if (!isValidCountry(country)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const countryRecord: CountryBD = {
        id: randomUUID(),
        name: country.name.trim().replace(/\s+/g, " ")
    };

    return { success: true, code: 201, data: countryRecord };
}

export function updateCountry(idCountry: string, country: Country): UpdateSuccessService<CountryBD> | ErrorService {
    const countryIndex: number = countries.findIndex((country: CountryBD) => country.id === idCountry);
    if (countryIndex === -1) {
        return { success: false, code: 404, message: "Country not found" };
    }

    if (!isValidCountry(country)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const updatedCountry: CountryBD = {
        id: idCountry,
        name: country.name.trim().replace(/\s+/g, " ")
    };

    return { success: true, code: 200, data: updatedCountry, index: countryIndex };
}