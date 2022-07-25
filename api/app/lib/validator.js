

/**
 * validation functions for checking parameters and schemas
 *
 * the heavy lifting is mostly done by ZSchema and swagger-parameters
 */

const
    ZSchema = require('z-schema');
    const config = require('../../config/config.js');

    const schema = require(`../../config/${  config.get('specification')}`);
    const options = {assumeAdditional: true}; // ban additional properties and array items from the schema (no unexpected things)
    const schemaValidator = new ZSchema(options);
    const parameterValidator = require('swagger-parameters');


/**
 * validate :id parameters
 * we make no assumptions about the type of the provided :id, but check that valid == an integer > 0
 * could be validated against a schema of { 'type': 'integer', 'minimum': 0 }
 *
 * @param id    of any Type
 * @returns {boolean}
 */
const validateId = id => {
    const _id = parseInt(id); // force to integer returns NaN if not
    return Number.isInteger(_id) && (_id > 0) // big fat assumption that ids start at 1, not 0 (ok for standard mysql autoincrements)
};

/**
 * validate query parameters using swagger-parameters, and return a parsed query with types corrected to those in schema
 *
 * as we're only checking queries, and not paths or headers, instead of swagger-parameters {query:.., path:.., header:...} require just a req.query
 * @param actual    req.query object
 * @param schema    parameters schema to validate against
 * @param done
 */
const validateParameters = (actual, schema) => new Promise((resolve, reject) => {
            const parse = parameterValidator(schema);
    parse({query: actual}, (err, result) => {
        if (err) return reject(err);
    return resolve(result.query);
})
});

/**
 * validate some object against the API schema
 *
 * @param actual        the object to be validated (usually a req.body)
 * @param schemaPath    if supplied, sub-schema to be used for validation (passed directly to ZSchema schemaPath)
 */
const validateSchema = (actual, schemaPath = 'definitions') => schemaValidator.validate(actual, schema,  {schemaPath });

const getLastErrors = () => schemaValidator.getLastErrors();

module.exports = {
    isValidSchema: validateSchema,
    areValidParameters: validateParameters,
    getLastErrors,
    isValidId: validateId
};
