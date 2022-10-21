const camelCaseRegex = /[_ -]+([a-zA-Z0-9])/g

/** @param {string} str */
export function camelCase(str) {
    return str.replace(camelCaseRegex, function (_, c) {
        return c.toUpperCase()
    })
}

const snakeCaseRegex = / +/g

/** @param {string} str */
export function snakeCase(str) {
    return str.toLowerCase().replace(snakeCaseRegex, '-')
}
