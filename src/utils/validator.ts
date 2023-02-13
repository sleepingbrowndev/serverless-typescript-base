import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true, coerceTypes: false, verbose: true });
import { logger } from "../utils/utilities";

export interface JsonSchemaValidationError {
    ajvSchemaPath: string;
    ajvDataPath: string;
    ajvMessage: string;
    jsonPath: string;
}

/**
 * It takes a JSON schema and a payload, and returns an object with a boolean `valid` property and an
 * `errors` property that is either null or an object with the first error
 * @param schema - The JSON schema to validate against (from AJV Validation).
 * @param payload - The payload in object to validate.
 * @returns An object with two properties: valid and errors.
 *         eg: { valid: true, errors: null }
 * @example ajvValidation(schema, payload)
 */
export default function ajvValidation(schema: object, payload: object) {
    const validate = ajv.compile(schema);

    const result = validate(payload);
    if (!result) {
        const errors = ajv.errors;
        if (errors) {
            const errs: JsonSchemaValidationError[] = [];

            for (const err of errors) {
                const jsonPath = err.instancePath.replace(/^\./, "").replace(/\[([0-9]+)\]/g, ".$1");
                errs.push({
                    ajvDataPath: err.instancePath,
                    ajvMessage: err.message ? err.message : "",
                    ajvSchemaPath: err.schemaPath,
                    jsonPath,
                });
            }
            logger.error('Unexpected error occurred while trying to validate the payload', JSON.stringify(errs));
            return errs;
        }
        return false;
    }
    return true;
}