import { Country } from "../interfaces/country/country";

export function isValidCountry(country: Country): boolean {
    return Boolean(country)
        && typeof country.name === "string"
        && country.name.trim().length > 0;
}
