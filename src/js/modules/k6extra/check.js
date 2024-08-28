
// Drop-in replacement for k6/check function.
// Added functionalities:
// - Verbose logging on failed checks
// - Optionally logging all checks
// Use it as if it was vanilla k6 http library(API docs: https://k6.io/docs/javascript-api/k6/check)
// example import: import check from "../modules/k6extra/check.js"

import { check } from 'k6';
import * as log from "./log.js"

// LOG_ON_* parameters can enable logging FAILED/SUCCEEDED checks in quite a verbose way,
// which makes debugging waaay easier.
// Recommendended to keep FAILURE logging enabled and SUCCESS logging disabled by default.
const LOG_ON_SUCCESS = false;
const LOG_ON_FAILURE = false;


// The main checking function
// Params:
// - values: single value passed to the checking functions. If multiple values ought to be used,
//           either use a struct, as in:
//           check({a: 1, b:1}, {"Example Check": (x)=> x.a == x.b})
//           or use the MultiArgCheck function
// - checks: list of function callbacks to run as validation.
// - tags: tags as documented by the official K6 documentation for the k6/check function arguments
export default function (value, checks, tags) {
    varArgCheck([value], checks, tags)
}


// Just as the main checking function, but with an extra functionality of variable-length parameter function callbacks
// Params:
// - values: single value or a list of values to pass it to the check functions. Its value(s) are shown during logging.
//           If only an array is desired to be used as a parameter, then it must be encapsulated into another array,
//           or else it's contents will be spread as seperate parameters to the check function
// - checks: list of function callbacks to run as validation.
// - tags: tags as documented by the official K6 documentation for the k6/check function arguments
// Example: check.varArgCheck([true,2,{x:3}], {"Example check": (first, second, third) => first && second == third.x})
export function varArgCheck(values, checks, tags) {
    for (const checkName in checks) {
        const checkFunc = checks[checkName]

        let success = null
        let exception = null


        try {
            // [].concat can accept both arrays and single values, and makes it sure that an array is returned
            success = checkFunc.apply(checkFunc, [].concat(values))
        } catch (ex) {
            exception = ex
        }

        // Psuedo-execute vanilla K6 check, so it shows up in the results
        check(success, { [checkName]: (x) => x }, tags)

        let logStruct = {
            values: values,
            tags: tags,
            checkName: checkName,
            checkFunc: checkFunc
        }

        if (exception) {
            logStruct.exception = {
                name: exception.name,
                message: exception.message
            }
            log.event("CHECK_RAISED_EXCEPTION", logStruct)
            throw exception
        } else if (!success & LOG_ON_FAILURE) {
            log.event("CHECK_FAILED", logStruct)
        } else if (LOG_ON_SUCCESS) {
            log.event("CHECK_SUCCEEDED", logStruct)
        }
    }
}
