const Response = require('@Formators/ApiResponseFormator');
/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
const checkPassword = (res, password = '', user = {}) => {
  return new Promise((resolve, reject) => {
    user.comparePassword(password, user, (err, isMatch) => {
      if (err) {
        return Response.errorWithCode(res, 404, 'Invalid credentials.', {});
      }
      if (!isMatch) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

module.exports = { checkPassword }