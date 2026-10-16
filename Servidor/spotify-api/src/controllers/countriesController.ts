import { countries } from "../data/country/country";
import { CountryBD } from "../interfaces/country/countryBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { createCountry, getAllCountries, getCountryById, updateCountry } from "../Services/countryService";
import { Response, Request } from "express";

export function getAllCountriesController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllCountries());
}

export function getCountriesByIdController(req: Request, res: Response): Response {
    const idCountry: string = req.params.id as string;
    const country: CountryBD | undefined = getCountryById(idCountry);
    if (!country) {
        return res.status(404).json({ message: `Country ${idCountry} not found` });
    }
    return res.status(200).json(country);
}

export function putCountriesController(req: Request, res: Response): Response {
    const idCountry: string = req.params.id as string;

    const result: UpdateSuccessService<CountryBD> | ErrorService = updateCountry(idCountry, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<CountryBD>;
    countries[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
}

export function postCountriesController(req: Request, res: Response): Response {
    const result: CreateSuccessService<CountryBD> | ErrorService = createCountry(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<CountryBD>;
    countries.push(createResult.data);
    return res.status(createResult.code).json(createResult);
}

