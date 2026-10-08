import { countries } from "../data/country/country";
import { CountryBD } from "../interfaces/country/countryBD";

export function getAllCountries(): CountryBD[] {
    return countries;
}

export function getCountryById(idCountry: string): CountryBD | undefined {
    return countries.find((country: CountryBD) => country.id === idCountry);
}