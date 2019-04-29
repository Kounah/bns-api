/**
 * checks the request for admin authentication
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
function admin(req, res, next) {
  next();
}

/**
 * checks the request for public authentication
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
function public(req, res, next) {
  next();
}

/**
 * checks the request for user authentication
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
function user(req, res, next) {
  next();
}

module.exports = {
  admin,
  public,
  user
};